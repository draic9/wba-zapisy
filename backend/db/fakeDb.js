let registrations = [];

module.exports = {
  add(registration) {
    const id = Date.now().toString();
    const newRegistration = {
      id,
      ...registration,
      createdAt: new Date().toISOString(),
      // crc służy jako identyfikator korelacyjny dla TPay (hiddenDescription / tr_crc)
      crc: id,
      payment: {
        status: 'pending', // 'pending' | 'paid'
        trId: null,
        paidAt: null,
        amountPaid: null,
      },
    };
    registrations.push(newRegistration);
    console.log('Aktualne rejestracje:', registrations);
    return newRegistration;
  },
  all() {
    return [...registrations];
  },
  clear() {
    // Przyda się do testów
    registrations = [];
  },
  // Idempotentna aktualizacja płatności po crc (hiddenDescription / tr_crc)
  updatePaymentByCrc(crc, update) {
    const reg = registrations.find((r) => r.crc === crc);
    if (!reg) {
      console.warn('updatePaymentByCrc: nie znaleziono rejestracji dla crc:', crc);
      return null;
    }
    if (reg.payment && reg.payment.status === 'paid') {
      // Idempotencja – jeśli już opłacone, nic nie zmieniamy
      return reg;
    }
    reg.payment = {
      ...reg.payment,
      ...update,
    };
    console.log('Zaktualizowano płatność dla rejestracji:', reg.id, reg.payment);
    return reg;
  },
};