const nodemailer = require('nodemailer');

const CONTACT_TARGET = 'bieg.wroclawski.wba@gmail.com';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function sanitizeMessage(message) {
  if (!message) return '';
  return String(message).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function baseLayout({ preheader, heading, subtitle, bodyHtml, footerHtml, imageUrl }) {
  const safePreheader = sanitizeMessage(preheader || '');
  const safeHeading = heading || '';
  const safeSubtitle = subtitle || '';

  const imageBlock = imageUrl
    ? `
    <tr>
      <td style="padding:0 24px 16px 24px;">
        <img src="${imageUrl}" alt="Ilustracja" style="display:block;width:100%;max-width:640px;border-radius:12px;" />
      </td>
    </tr>
  `
    : '';

  return `
  <!DOCTYPE html>
  <html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Bebas+Neue&display=swap" rel="stylesheet">
    <title>Wiadomość – Wrocławski Bieg Akademicki</title>
  </head>
  <body style="margin:0;padding:0;background:#0b0b0b;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${safePreheader}
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0b0b0b;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#111111;border:1px solid #27272a;border-radius:16px;overflow:hidden;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#f4f4f5;">
            <tr>
              <td style="padding:24px 24px 16px 24px;border-bottom:1px solid #27272a;">
                <div style="display:inline-block;background:#FD5100;color:#fff;font-size:11px;font-weight:700;letter-spacing:2px;padding:4px 10px;border-radius:4px;margin-bottom:12px;font-family:Arial,sans-serif;">
                  BIEG AKADEMICKI
                </div>
                <div style="font-family:'Bebas Neue',Arial Black,Arial,sans-serif;font-size:28px;letter-spacing:1px;color:#FD5100;text-transform:uppercase;">
                  ${safeHeading}
                </div>
                ${safeSubtitle
                  ? `<div style=\"margin-top:4px;font-size:14px;color:#a1a1aa;\">${safeSubtitle}</div>`
                  : ''}
              </td>
            </tr>

            ${imageBlock}

            <tr>
              <td style="padding:24px;">
                ${bodyHtml || ''}
              </td>
            </tr>

            <tr>
              <td style="padding:20px 24px;border-top:1px solid #27272a;font-size:12px;color:#71717a;line-height:1.6;">
                ${footerHtml || ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

async function sendContactEmail({ name, email, message }) {
  const safeMessage = sanitizeMessage(message);

  const bodyHtml = `
    <p style="margin:0 0 12px 0;font-size:14px;color:#e4e4e7;">
      <strong>Od:</strong> ${sanitizeMessage(name || '(brak imienia)')} &lt;${sanitizeMessage(email)}&gt;
    </p>
    <p style="margin:0 0 8px 0;font-size:14px;color:#a1a1aa;">Treść wiadomości:</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:16px;font-size:14px;line-height:1.6;color:#e4e4e7;white-space:pre-wrap;">
          ${safeMessage}
        </td>
      </tr>
    </table>
  `;

  const footerHtml = `
    Ta wiadomość została automatycznie wysłana z formularza kontaktowego na stronie
    <a href="https://wroclawskibiegakademicki.pl" target="_blank" rel="noopener noreferrer"><span style="color:#FD5100;">Wrocławski Bieg Akademicki</span></a>.
    <br><br>
    Jeśli chcesz odpowiedzieć, użyj opcji „Odpowiedz” w swojej skrzynce.
  `;

  const html = baseLayout({
    preheader: 'Nowa wiadomość z formularza kontaktowego – Wrocławski Bieg Akademicki',
    heading: 'Wiadomość z formularza',
    subtitle: 'Wrocławski Bieg Akademicki',
    bodyHtml,
    footerHtml,
    imageUrl: null,
  });

  await transporter.sendMail({
    from: `Strona Bieg Akademicki <${process.env.SMTP_USER}>`,
    to: CONTACT_TARGET,
    replyTo: email,
    subject: `Wiadomość z formularza kontaktowego od: ${name || email}`,
    text: message,
    html,
  });
}

async function sendRegistrationPendingEmail({ email, name, paymentUrl }) {
  const safeName = sanitizeMessage(name || 'Uczestnik');
  const safeUrl = sanitizeMessage(paymentUrl);

  const bodyHtml = `
    <p style="margin:0 0 12px 0;font-size:14px;color:#e4e4e7;">
      Cześć ${safeName},
    </p>
    <p style="margin:0 0 12px 0;font-size:14px;color:#e4e4e7;">
      Twoja rejestracja na <strong>Wrocławski Bieg Akademicki</strong> została przyjęta. Aby dokończyć zgłoszenie,
      opłać swój udział, korzystając z poniższego przycisku.
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0;">
      <tr>
        <td>
          <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#FD5100;color:#ffffff;font-weight:600;font-size:14px;padding:12px 24px;border-radius:999px;text-decoration:none;">
            OPŁAĆ UCZESTNICTWO
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 12px 0;font-size:13px;color:#a1a1aa;">
      Jeśli przycisk nie działa, skopiuj i wklej ten adres w pasku przeglądarki:<br />
      <span style="color:#FD5100;word-break:break-all;">${safeUrl}</span>
    </p>
  `;

  const footerHtml = `
    Ten e-mail został wysłany automatycznie po zarejestrowaniu się na bieg.
    Jeśli to nie Ty wypełniałeś formularz, zignoruj tę wiadomość.
  `;

  const html = baseLayout({
    preheader: 'Twoja rejestracja została przyjęta – dokończ zgłoszenie, opłacając udział.',
    heading: 'Rejestracja przyjęta',
    subtitle: 'Czekamy na potwierdzenie płatności',
    bodyHtml,
    footerHtml,
    imageUrl: 'https://wroclawskibiegakademicki.pl/plain-assets/runner1.png',
  });

  await transporter.sendMail({
    from: `Wrocławski Bieg Akademicki <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Twoja rejestracja została przyjęta – opłać udział w biegu',
    html,
  });
}

async function sendPaymentSuccessEmail({ email, name, amount, distance }) {
  const safeName = sanitizeMessage(name || 'Uczestnik');
  const safeAmount = amount != null ? String(amount) : '';
  const safeDistance = sanitizeMessage(distance || '');

  const bodyHtml = `
    <p style="margin:0 0 12px 0;font-size:14px;color:#e4e4e7;">
      Cześć ${safeName},
    </p>
    <p style="margin:0 0 12px 0;font-size:14px;color:#e4e4e7;">
      Twoja płatność za udział w <strong>Wrocławskim Biegu Akademickim</strong> została pomyślnie zaksięgowana.
    </p>
    <p style="margin:0 0 12px 0;font-size:14px;color:#e4e4e7;">
      Dystans: <strong>${safeDistance || '—'}</strong><br/>
      Kwota: <strong>${safeAmount ? safeAmount + ' zł' : '—'}</strong>
    </p>
    <p style="margin:0 0 12px 0;font-size:14px;color:#e4e4e7;">
      Dzięki Twojemu wsparciu ten bieg staje się czymś więcej niż tylko wydarzeniem sportowym – to realna pomoc dla naszych podopiecznych.
    </p>
    <p style="margin:0 0 12px 0;font-size:14px;color:#e4e4e7;">
      Każdy krok, który przebiegniesz, i każda złotówka, którą właśnie przekazałeś, pomagają nam zmieniać świat na lepsze.
      Razem możemy zrobić dużo więcej, niż ktokolwiek z nas osobno.
    </p>
  `;

  const footerHtml = `
    Dziękujemy, że dołączasz do naszej społeczności i wspierasz to wydarzenie charytatywne.
    Do zobaczenia na starcie!
  `;

  const html = baseLayout({
    preheader: 'Dziękujemy za opłacenie udziału w Wrocławskim Biegu Akademickim.',
    heading: 'Płatność potwierdzona',
    subtitle: 'Dziękujemy z całego serca',
    bodyHtml,
    footerHtml,
    imageUrl: 'https://wroclawskibiegakademicki.pl/plain-assets/runner2.png',
  });

  await transporter.sendMail({
    from: `Wrocławski Bieg Akademicki <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Dziękujemy za opłacenie udziału w biegu',
    html,
  });
}

module.exports = {
  sendContactEmail,
  sendRegistrationPendingEmail,
  sendPaymentSuccessEmail,
};
