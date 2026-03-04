const { X509Certificate, createVerify } = require('crypto');

// Helper: convert base64url -> base64
function base64UrlToBase64(str) {
  return str.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(str.length / 4) * 4, '=');
}

const TPAY_ENV = (process.env.TPAY_ENV || 'sandbox').toLowerCase();
const MODE = (process.env.TPAY_JWS_MODE || TPAY_ENV || 'sandbox').toLowerCase();
const isProdMode = MODE === 'production' || MODE === 'prod';

// Główna funkcja weryfikacji JWS dla webhooka TPay
// Zakładamy, że:
// - surowe body requestu jest dostępne jako req.rawBody (ustawiane przez middleware)
// - sparsowane body (x-www-form-urlencoded) jest w req.body – używasz go już do logów
async function verifyTpayJws(req) {
  const jws = req.headers['x-jws-signature'];

  if (!jws) {
    return { isValid: false, reason: 'Missing x-jws-signature header' };
  }

  const parts = jws.split('.');
  if (parts.length !== 3) {
    return { isValid: false, reason: 'Invalid JWS format (expected 3 parts)' };
  }

  const [headerPart, /* payloadPart - ignorujemy */, signaturePart] = parts;

  // Dekodowanie i parsowanie nagłówka JWS
  let headerJson;
  try {
    const headerDecoded = Buffer.from(base64UrlToBase64(headerPart), 'base64').toString('utf8');
    headerJson = JSON.parse(headerDecoded);
  } catch (e) {
    return { isValid: false, reason: 'Cannot decode JWS header: ' + e.message };
  }

  if (!headerJson.x5u) {
    return { isValid: false, reason: 'Missing x5u in JWS header' };
  }

  // Zmieniona funkcjonalność weryfikacji na potrzeby środowiska sandboxowego. 
  // Warunek x5u jest zbyt restrykcyjny na potrzeby środowiska testowego.
  const allowedX5uPrefixes = [
    'https://secure.tpay.com',
    'https://secure.sandbox.tpay.com',
  ];

  const matchesAllowedPrefix = allowedX5uPrefixes.some((prefix) =>
    headerJson.x5u.startsWith(prefix),
  );

  if (!matchesAllowedPrefix) {
    return {
      isValid: false,
      reason: `x5u does not start with any allowed prefix: ${allowedX5uPrefixes.join(', ')}`,
    };
  }

  // Dobierz właściwy root CA w zależności od środowiska i hosta w x5u
  const isSandboxCert = headerJson.x5u.startsWith('https://secure.sandbox.tpay.com');
  const caUrl = isSandboxCert
    ? 'https://secure.sandbox.tpay.com/x509/tpay-jws-root.pem'
    : 'https://secure.tpay.com/x509/tpay-jws-root.pem';

  // Pobierz certyfikat(y) zależnie od trybu: sandbox vs production
  let signingCertPem;
  let caCertPem;

  try {
    const signingRes = await fetch(headerJson.x5u);
    signingCertPem = await signingRes.text();

    // W obu trybach (sandbox/production) chcemy pełną weryfikację łańcucha
    const caRes = await fetch(caUrl);
    caCertPem = await caRes.text();
  } catch (e) {
    return { isValid: false, reason: 'Error fetching certificate(s): ' + e.message };
  }

  // Załaduj certyfikat(y)
  let x5uCert;
  let caCert;
  try {
    x5uCert = new X509Certificate(signingCertPem);
    caCert = new X509Certificate(caCertPem);
  } catch (e) {
    return { isValid: false, reason: 'Error loading certificate(s): ' + e.message };
  }

  // W produkcji wymagamy poprawnego łańcucha CA, w sandboxie można to zostawić włączone
  if (isProdMode || !isProdMode) {
    const caPublicKey = caCert.publicKey;
    if (!x5uCert.verify(caPublicKey)) {
      return { isValid: false, reason: 'Signing certificate is not signed by Tpay CA certificate' };
    }
  }

  const rawBody = req.rawBody || '';

  // Payload w base64url z surowego body (application/x-www-form-urlencoded)
  const payloadBase64 = Buffer.from(rawBody, 'utf8').toString('base64');
  const payloadBase64Url = payloadBase64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

  // Dekoduj podpis
  const decodedSignature = Buffer.from(base64UrlToBase64(signaturePart), 'base64');

  // Weryfikacja podpisu
  // Algorytm z nagłówka to zwykle RS256 -> w Node odpowiada to 'RSA-SHA256'
  const verifier = createVerify('RSA-SHA256');
  verifier.update(`${headerPart}.${payloadBase64Url}`);
  verifier.end();

  const publicKey = x5uCert.publicKey;
  const isValid = verifier.verify(publicKey, decodedSignature);

  if (!isValid) {
    return { isValid: false, reason: 'Invalid JWS signature' };
  }

  return { isValid: true, reason: 'OK', header: headerJson };
}

module.exports = {
  verifyTpayJws,
};
