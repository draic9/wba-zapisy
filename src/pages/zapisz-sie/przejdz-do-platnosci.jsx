import React from 'react';

const ZapiszSiePrzejdzDoPlatnosciPage = () => {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12 font-body">
      <div className="w-full max-w-xl bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-[#fd5100]">
          Dziękujemy za zgłoszenie!
        </h1>
        <p className="text-zinc-200 mb-4 text-sm md:text-base">
          Twoje dane zostały zapisane. Aby dokończyć rejestrację na bieg,
          opłać swój udział w nowo otwartej karcie płatności.
        </p>
        <p className="text-zinc-400 text-xs md:text-sm mb-6">
          Jeśli nie widzisz strony płatności, sprawdź blokadę wyskakujących okienek
          w przeglądarce lub spróbuj ponownie z innej przeglądarki.
        </p>
        <a
          href="/zapisz-sie"
          className="inline-flex items-center justify-center px-6 py-2 rounded-full text-sm font-semibold bg-[#fd5100] text-white hover:opacity-90 transition-colors"
        >
          Wróć do formularza
        </a>
      </div>
    </main>
  );
};

export default ZapiszSiePrzejdzDoPlatnosciPage;
