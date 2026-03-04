require('dotenv').config();

const { getAccessToken } = require('./services/tpayAuthService');

async function testTpayAuth() {
  console.log('--- TPay OAuth test start ---');

  try {
    const token = await getAccessToken();

    if (!token) {
      console.error('Brak tokenu – getAccessToken() zwrócił false');
    } else {
      const preview = `${token.slice(0, 8)}...${token.slice(-4)}`;
      console.log('TPay access token (preview):', preview);
      console.log('Długość tokenu:', token.length);
    }

    console.log('--- TPay OAuth test success ---');
    process.exit(0);
  } catch (error) {
    console.error('--- TPay OAuth test FAILED ---');

    // Podstawowe info o błędzie
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);

    // Szczegóły z odpowiedzi HTTP (jeśli są)
    if (error.response) {
      console.error('HTTP status:', error.response.status);
      console.error('HTTP statusText:', error.response.statusText);
      console.error('Response data:', error.response.data);
      console.error('Request URL:', error.config?.url);
      console.error('Request method:', error.config?.method);
      console.error('Request headers:', error.config?.headers);
      console.error('Request data:', error.config?.data);
    } else if (error.request) {
      console.error('Brak odpowiedzi z serwera TPay (error.request istnieje, ale brak response).');
    }

    console.error('Pełny obiekt błędu:', error);
    process.exit(1);
  }
}

// Uruchom test, jeśli plik został odpalony bezpośrednio przez node
if (require.main === module) {
  testTpayAuth();
}

module.exports = { testTpayAuth };
