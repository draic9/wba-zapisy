import React from 'react';

const ZapiszSieSukcesPage = () => {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12 font-body">
      <div className="w-full max-w-xl bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-[#fd5100]">
          Dziękujemy z całego serca!
        </h1>
        <p className="text-zinc-200 mb-4 text-sm md:text-base">
          Twoja płatność została pomyślnie zaksięgowana. Dzięki Twojemu wsparciu
          ten bieg staje się czymś więcej niż tylko wydarzeniem sportowym – to
          realna pomoc dla naszych podopiecznych.
        </p>
        <p className="text-zinc-200 mb-4 text-sm md:text-base">
          Każdy krok, który przebiegniesz, i każda złotówka, którą właśnie
          przekazałeś, pomagają nam zmieniać świat na lepsze. Razem możemy
          zrobić dużo więcej, niż ktokolwiek z nas osobno.
        </p>
        <p className="text-zinc-400 text-xs md:text-sm mb-6">
          Dziękujemy, że dołączasz do naszej społeczności i wspierasz to
          wydarzenie charytatywne. Do zobaczenia na starcie!
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-2 rounded-full text-sm font-semibold bg-[#fd5100] text-white hover:opacity-90 transition-colors"
        >
          Wróć na stronę główną
        </a>
      </div>
    </main>
  );
};

export default ZapiszSieSukcesPage;
