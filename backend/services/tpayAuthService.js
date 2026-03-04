const axios = require('axios');

let accessToken = null;
let expiresAt = 0; // timestamp w ms

// ile sekund przed wygaśnięciem odświeżamy token
const EXPIRY_MARGIN_SECONDS = 60;

const TPAY_ENV = (process.env.TPAY_ENV || 'sandbox').toLowerCase();
const TPAY_OAUTH_URL =
  process.env.TPAY_OAUTH_URL ||
  (TPAY_ENV === 'prod' || TPAY_ENV === 'production'
    ? 'https://openapi.tpay.com/oauth/auth'
    : 'https://openapi.sandbox.tpay.com/oauth/auth');

async function fetchNewToken() {
  const response = await axios.post(
    TPAY_OAUTH_URL,
    new URLSearchParams({
      client_id: process.env.TPAY_CLIENT_ID,
      client_secret: process.env.TPAY_CLIENT_SECRET,
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const { access_token, expires_in } = response.data;

  const now = Date.now(); // ms
  const marginMs = EXPIRY_MARGIN_SECONDS * 1000;
  expiresAt = now + expires_in * 1000 - marginMs;

  accessToken = access_token;
  return accessToken;
}

function isTokenValid() {
  if (!accessToken) return false;
  const now = Date.now();
  return now < expiresAt;
}

async function getAccessToken() {
  if (isTokenValid()) {
    return accessToken;
  }
  return await fetchNewToken();
}

module.exports = {
  getAccessToken,
};