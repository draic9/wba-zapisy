const express = require('express');
const { createHash } = require('crypto');
const { verifyTpayJws } = require('../services/tpayJwsVerifier');
const registrationRepository = require('../db/registrationRepository');
const logger = require('../utils/logger');
const { sendPaymentSuccessEmail } = require('../services/mailService');

const router = express.Router();

// Webhook TPay – z weryfikacją podpisu JWS, ale bez zmiany statusu.
// Pełny adres, pod który TPay będzie wysyłał powiadomienia, to:
//   <twoj-publiczny-url>/api/tpay/notification
// (np. adres z ngrok + "/api/tpay/notification").

router.post('/tpay/notification', async (req, res) => {
	try {
		const { isValid, reason } = await verifyTpayJws(req);

		if (!isValid) {
			logger.error('TPay webhook – invalid JWS:', {
				reason,
				headers: req.headers,
				bodyPreview: req.rawBody ? req.rawBody.slice(0, 300) : null,
			});
			// Zgodnie z wymaganiami TPay zwracamy FALSE, aby wskazać błąd
			return res.status(200).send('FALSE');
		}

		logger.info('TPay webhook – JWS OK');
		logger.info('TPay webhook – body:', req.body);

		const {
			id,
			tr_id,
			tr_amount,
			tr_crc,
			tr_status,
			tr_paid,
			md5sum,
		} = req.body;

		// Walidacja md5sum
		const merchantId = process.env.TPAY_MERCHANT_ID || '';
		const md5Code = process.env.TPAY_MD5_CODE || '';

		if (!merchantId || !md5Code) {
			logger.error('TPay webhook – brak TPAY_MERCHANT_ID lub TPAY_MD5_CODE w env', {
				merchantIdPresent: Boolean(merchantId),
				md5CodePresent: Boolean(md5Code),
				bodySnapshot: { tr_id, tr_amount, tr_crc, tr_status },
			});
			return res.status(200).send('FALSE');
		}

		const expectedMd5 = createHash('md5')
			.update(`${merchantId}${tr_id}${tr_amount}${tr_crc}${md5Code}`)
			.digest('hex');

		if (!md5sum || md5sum.toLowerCase() !== expectedMd5.toLowerCase()) {
			logger.error('TPay webhook – md5sum mismatch', {
				md5sumReceived: md5sum,
				expectedMd5,
				merchantId,
				tr_id,
				tr_amount,
				tr_crc,
				tr_status,
			});
			return res.status(200).send('FALSE');
		}

		// Idempotentna aktualizacja statusu płatności tylko dla udanych transakcji
		if (String(tr_status).toUpperCase() === 'TRUE') {
			const updated = await registrationRepository.updatePaymentByCrc(tr_crc, {
				status: 'paid',
				trId: tr_id,
				paidAt: new Date().toISOString(),
				amountPaid: tr_paid,
			});

			if (updated) {
				logger.info('Status płatności w bazie danych został zaktualizowany na "paid"', {
					tr_crc,
					tr_id,
					tr_status,
					tr_paid,
				});

				// Mail potwierdzający płatność (nie wpływa na odpowiedź webhooka)
				try {
					await sendPaymentSuccessEmail({
						email: updated.email,
						name: updated.name,
						amount: updated.payment && updated.payment.amountPaid,
						distance: updated.distance,
					});
				} catch (mailError) {
					logger.error('Błąd wysyłki maila po potwierdzeniu płatności:', mailError);
				}
			} else {
				logger.warn('TPay webhook – brak rejestracji dla tr_crc:', tr_crc);
			}
		} else {
			logger.info('TPay webhook – tr_status != TRUE, brak zmiany statusu płatności', {
				tr_status,
				tr_crc,
				tr_id,
			});
		}

		// Wszystkie walidacje przeszły – potwierdzamy odbiór
		return res.status(200).send('TRUE');
	} catch (error) {
		logger.error('TPay webhook – error during JWS verification:', {
			error: error && error.message ? error.message : String(error),
			stack: error && error.stack,
			headers: req.headers,
			bodyPreview: req.rawBody ? req.rawBody.slice(0, 300) : null,
			// Dodatkowe dane z error.response, jeśli dostępne (np. z biblioteki HTTP)
			responseStatus: error && error.response && error.response.status,
			responseData: error && error.response && error.response.data,
		});
		// W razie błędu też zwracamy FALSE (Tpay może spróbować ponowić notyfikację)
		return res.status(200).send('FALSE');
	}
});

module.exports = router;
