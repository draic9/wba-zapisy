require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const registrationRoutes = require('./routes/registration');
const tpayWebhookRoutes = require('./routes/tpayWebhook');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
// TODO: Alternatywnie możemy dodać express.urlencoded tylko dla konkretnej trasy, ale globalne bodyParser.urlencoded na tym etapie jest OK.
// Przechwycenie surowego body (req.rawBody), potrzebne do weryfikacji JWS od TPay
app.use(bodyParser.urlencoded({
  extended: false,
  verify: (req, res, buf, encoding) => {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  },
}));

// Routes
app.use('/api', registrationRoutes);
app.use('/api', tpayWebhookRoutes);
app.use('/api', contactRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('Backend działa!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});