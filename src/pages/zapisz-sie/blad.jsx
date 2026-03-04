import React from 'react';

const ZapiszSieBladPage = () => {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12 font-body">
      <div className="w-full max-w-xl bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-[#fd5100]">
          Coś poszło nie tak
        </h1>
        <p className="text-zinc-200 mb-4 text-sm md:text-base">
          Nie udało się przetworzyć Twojego zgłoszenia lub nawiązac połączenia z serwerem.
        </p>
        <p className="text-zinc-400 text-xs md:text-sm mb-6">
          Spróbuj ponownie za chwilę. Jeśli problem się powtarza, skontaktuj się z organizatorami biegu.
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

export default ZapiszSieBladPage;
