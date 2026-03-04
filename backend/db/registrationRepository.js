const pool = require('./pool');

// Repozytorium rejestracji o API zbliżonym do fakeDb
// - add(formData) -> new registration (z id/crc i payment*)
// - updatePaymentByCrc(crc, update) -> zaktualizowana rejestracja lub null

async function add(formData) {
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();

  const {
    name,
    email,
    distance,
    tshirt,
    terms,
    newsletter,
    firstName,
    lastName,
    birthDate,
    gender,
    category,
    packageType,
    team,
  } = formData;

  const query = `
    INSERT INTO registrations (
      id,
      name,
      first_name,
      last_name,
      birth_date,
      gender,
      email,
      distance,
      tshirt,
      category,
      package_type,
      team,
      terms,
      newsletter,
      created_at,
      payment_status,
      payment_tr_id,
      payment_paid_at,
      payment_amount
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
      'pending', NULL, NULL, NULL
    )
    RETURNING *;
  `;

  const values = [
    id,
    name,
    firstName || null,
    lastName || null,
    birthDate ? new Date(birthDate) : null,
    gender || null,
    email,
    distance,
    tshirt || null,
    category || null,
    packageType || null,
    team || null,
    Boolean(terms),
    Boolean(newsletter),
    createdAt,
  ];

  const { rows } = await pool.query(query, values);
  const row = rows[0];

  return {
    id: row.id,
    name: row.name,
    firstName: row.first_name,
    lastName: row.last_name,
    birthDate: row.birth_date ? row.birth_date.toISOString().slice(0, 10) : null,
    gender: row.gender,
    email: row.email,
    distance: row.distance,
    tshirt: row.tshirt,
    category: row.category,
    packageType: row.package_type,
    team: row.team,
    terms: row.terms,
    newsletter: row.newsletter,
    createdAt: row.created_at.toISOString(),
    crc: row.id,
    payment: {
      status: row.payment_status,
      trId: row.payment_tr_id,
      paidAt: row.payment_paid_at ? row.payment_paid_at.toISOString() : null,
      amountPaid: row.payment_amount,
    },
  };
}

async function all() {
  const { rows } = await pool.query('SELECT * FROM registrations ORDER BY created_at DESC');
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    firstName: row.first_name,
    lastName: row.last_name,
    birthDate: row.birth_date ? row.birth_date.toISOString().slice(0, 10) : null,
    gender: row.gender,
    email: row.email,
    distance: row.distance,
    tshirt: row.tshirt,
    category: row.category,
    packageType: row.package_type,
    team: row.team,
    terms: row.terms,
    newsletter: row.newsletter,
    createdAt: row.created_at.toISOString(),
    crc: row.id,
    payment: {
      status: row.payment_status,
      trId: row.payment_tr_id,
      paidAt: row.payment_paid_at ? row.payment_paid_at.toISOString() : null,
      amountPaid: row.payment_amount,
    },
  }));
}

async function clear() {
  await pool.query('TRUNCATE TABLE registrations');
}

async function updatePaymentByCrc(crc, update) {
  // Pobierz aktualny stan
  const { rows } = await pool.query('SELECT * FROM registrations WHERE id = $1', [crc]);
  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];

  if (row.payment_status === 'paid') {
    // Idempotencja – jeśli już opłacone, nic nie zmieniamy
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      distance: row.distance,
      tshirt: row.tshirt,
      terms: row.terms,
      newsletter: row.newsletter,
      createdAt: row.created_at.toISOString(),
      crc: row.id,
      payment: {
        status: row.payment_status,
        trId: row.payment_tr_id,
        paidAt: row.payment_paid_at ? row.payment_paid_at.toISOString() : null,
        amountPaid: row.payment_amount,
      },
    };
  }

  const newStatus = update.status || row.payment_status;
  const newTrId = update.trId || row.payment_tr_id;
  const newPaidAt = update.paidAt || row.payment_paid_at;
  const newAmount = update.amountPaid != null ? update.amountPaid : row.payment_amount;

  await pool.query(
    `UPDATE registrations
     SET payment_status = $1,
         payment_tr_id = $2,
         payment_paid_at = $3,
         payment_amount = $4
     WHERE id = $5`,
    [newStatus, newTrId, newPaidAt, newAmount, crc]
  );

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    distance: row.distance,
    tshirt: row.tshirt,
    terms: row.terms,
    newsletter: row.newsletter,
    createdAt: row.created_at.toISOString(),
    crc: row.id,
    payment: {
      status: newStatus,
      trId: newTrId,
      paidAt: newPaidAt ? newPaidAt.toISOString ? newPaidAt.toISOString() : newPaidAt : null,
      amountPaid: newAmount,
    },
  };
}

module.exports = {
  add,
  all,
  clear,
  updatePaymentByCrc,
};
