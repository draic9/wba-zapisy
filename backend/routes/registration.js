const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const registrationRepository = require('../db/registrationRepository');
const logger = require('../utils/logger');
const { sendRegistrationPendingEmail } = require('../services/mailService');

// Endpoint do rejestracji
router.post('/register', async (req, res) => {
  try {
    const formData = req.body;
    logger.info('Odebrano dane rejestracji:', formData);
    
    // Najpierw zapisz rejestrację, aby mieć lokalne ID/CRC do powiązania z TPay
    const registration = await registrationRepository.add(formData);

    // Tutaj będzie logika walidacji i przetwarzania danych
    const paymentUrl = await paymentService.createPayment(formData, registration.id);

    // Mail transakcyjny z linkiem do płatności (bez blokowania odpowiedzi w razie błędu)
    try {
      await sendRegistrationPendingEmail({
        email: formData.email,
        name: formData.name || `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
        paymentUrl,
      });
    } catch (mailError) {
      logger.error('Błąd wysyłki maila po rejestracji:', mailError);
    }
    
    logger.info('Zapisano w bazie danych:', registration);

    res.json({
      success: true,
      message: 'Rejestracja przebiegła pomyślnie',
      paymentUrl: paymentUrl
    });
  } catch (error) {
    logger.error('Błąd podczas rejestracji:', error);
    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas przetwarzania rejestracji'
    });
  }
});

// Podgląd wszystkich rejestracji 
router.get('/registrations', (req, res) => {
  registrationRepository
    .all()
    .then((allRegistrations) => res.json(allRegistrations))
    .catch((error) => {
      logger.error('Błąd podczas pobierania rejestracji z bazy:', error);
      res.status(500).json({
        success: false,
        message: 'Wystąpił błąd podczas pobierania rejestracji',
      });
    });
});

// Eksport rejestracji do CSV
router.get('/registrations/export', async (req, res) => {
  try {
    const registrations = await registrationRepository.all();

    // Nagłówki CSV
    const headers = [
      'id',
      'name',
      'firstName',
      'lastName',
      'birthDate',
      'gender',
      'email',
      'distance',
      'tshirt',
      'category',
      'packageType',
      'team',
      'terms',
      'newsletter',
      'createdAt',
      'payment_status',
      'payment_trId',
      'payment_paidAt',
      'payment_amountPaid',
    ];

    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      // Proste escape'owanie: podwójne cudzysłowy i otoczenie w ""
      const escaped = str.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const lines = [];
    lines.push(headers.join(','));

    for (const reg of registrations) {
      const row = [
        reg.id,
        reg.name,
        reg.firstName,
        reg.lastName,
        reg.birthDate,
        reg.gender,
        reg.email,
        reg.distance,
        reg.tshirt,
        reg.category,
        reg.packageType,
        reg.team,
        reg.terms,
        reg.newsletter,
        reg.createdAt,
        reg.payment?.status,
        reg.payment?.trId,
        reg.payment?.paidAt,
        reg.payment?.amountPaid,
      ].map(escapeCsv);
      lines.push(row.join(','));
    }

    const csv = lines.join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="registrations.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    logger.error('Błąd podczas eksportu rejestracji do CSV:', error);
    return res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas eksportu rejestracji',
    });
  }
});

module.exports = router;
