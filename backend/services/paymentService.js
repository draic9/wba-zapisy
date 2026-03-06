const axios = require('axios');
const { getAccessToken } = require('./tpayAuthService');
const logger = require('../utils/logger');
const { calculateAmount } = require('../config/pricing');
const registrationRepository = require('../db/registrationRepository');

// Produkcyjny endpoint TPay (na razie sandbox / docelowy URL z docs)
// W razie potrzeby można go później przenieść do .env jako TPAY_TRANSACTIONS_URL
const TPAY_ENV = (process.env.TPAY_ENV || 'sandbox').toLowerCase();
const TpayTransactionsUrl =
	process.env.TPAY_TRANSACTIONS_URL ||
	(TPAY_ENV === 'prod' || TPAY_ENV === 'production'
		? 'https://openapi.tpay.com/transactions'
		: 'https://openapi.sandbox.tpay.com/transactions');

// Adresy stron sukcesu i porażki płatności
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const SUCCESS_URL = `${FRONTEND_URL}/zapisz-sie/sukces`;
const FAILURE_URL = `${FRONTEND_URL}/zapisz-sie/blad`;

async function createPayment(formData, correlationId) {
	const token = await getAccessToken();

	if (!token) {
		throw new Error('Brak tokenu TPay – getAccessToken() zwrócił pustą wartość');
	}

	const paidCount = await registrationRepository.countPaid();
	const amount = calculateAmount(formData, { paidCount });
	const description = 'Wrocławski Bieg Akademicki – opłata startowa';

	const payerEmail = formData.email;
	const payerName = formData.name || `${formData.firstName} ${formData.lastName}`;

	const body = {
		amount,
		description,
		// hiddenDescription wróci w webhooku jako tr_crc – używamy go do powiązania z rejestracją
		hiddenDescription: correlationId,

		payer: {
			email: payerEmail,
			name: payerName,
		},
		callbacks: {
			notification: {
				url: `${(TPAY_ENV === 'sandbox' && process.env.NGROK_URL
					? process.env.NGROK_URL
					: process.env.BACKEND_URL || 'http://localhost:3001')}/api/tpay/notification`,
			},
			payerUrls: {
				success: SUCCESS_URL,
				error: FAILURE_URL,
			},
		},
	};

	logger.info('TPay createPayment – request body:', body);

	try {
		const response = await axios.post(TpayTransactionsUrl, body, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		logger.info('TPay createPayment – response status:', response.status);
		logger.info('TPay createPayment – response data (skrót):', {
			result: response.data?.result,
			status: response.data?.status,
			transactionId: response.data?.transactionId,
			transactionPaymentUrl: response.data?.transactionPaymentUrl,
		});

		const paymentUrl = response.data?.transactionPaymentUrl;
		if (!paymentUrl) {
			throw new Error('Brak transactionPaymentUrl w odpowiedzi TPay');
		}

		return paymentUrl;
	} catch (error) {
		logger.error('TPay createPayment – error message:', error.message);
		if (error.response) {
			logger.error('TPay createPayment – HTTP status:', error.response.status);
			logger.error('TPay createPayment – response data:', error.response.data);
		}
		throw error;
	}
}

module.exports = {
	createPayment,
};