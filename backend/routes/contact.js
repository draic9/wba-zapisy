const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/mailService');

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!email || !message) {
    return res.status(400).json({ success: false, error: 'Brak wymaganych pól' });
  }

  try {
    await sendContactEmail({ name, email, message });

    return res.json({ success: true });
  } catch (err) {
    console.error('Błąd wysyłki maila kontaktowego:', err);
    return res.status(500).json({ success: false, error: 'Mail send failed' });
  }
});

module.exports = router;
