import React from 'react';

const IndexSectionCustomComponents2 = () => {
    return (
        <section id="start" className="relative min-h-screen bg-black overflow-hidden">
  <div className="absolute inset-0">
    <img src="https://static.shuffle.dev/uploads/files/0f/0fd5a595c7f5312ec1e6d5781f2f8035a4e0d813/WBA-2025-177.jpg" alt="Runner" className="w-full h-full object-cover opacity-40" />
    <div className="absolute inset-0 bg-linear-to-r from-black via-black/30 to-transparent" />
  </div>
  <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 flex flex-col justify-center min-h-screen">
    <div className="max-w-3xl">
      <span className="inline-block text-[#fd5100] font-bold text-lg mb-4 tracking-widest">31 MAJA 2026 • WROCŁAW • PARK GRABISZYŃSKI</span>
      <h1 className="font-heading text-6xl md:text-8xl text-white mb-6 leading-none tracking-tight">
        <span>XII WROCŁAWSKI BIEG</span>
        <br />
        <span className="text-[#fd5100]">AKADEMICKI</span>
      </h1>
      <p className="text-gray-300 text-xl mb-8 max-w-xl">Dołącz do największego Studenckiego Biegu we Wrocławiu! Zapraszamy studentów, pracowników uczelni i wszystkich mieszkańców miasta.</p>
      <div className="flex flex-wrap gap-4">
        <a href="#" className="bg-[#fd5100] text-white font-bold px-10 py-4 rounded-full text-lg hover:bg-orange-600 transition-colors inline-flex items-center gap-2">
          <span>ZAPISZ SIĘ</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        <a href="#wolontariat" className="border-2 border-white/30 text-white font-bold px-10 py-4 rounded-full text-lg hover:border-white transition-colors">ZOSTAŃ WOLONTARIUSZEM</a>
      </div>
    </div>
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
      <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </div>
</section>


    );
};

export default IndexSectionCustomComponents2;