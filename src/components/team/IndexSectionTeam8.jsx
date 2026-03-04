import React from 'react';

const IndexSectionTeam8 = () => {
    return (
        <section className="bg-black py-20">
  <div className="container px-4 mx-auto">
    <div className="max-w-3xl mx-auto mb-12 lg:mb-16 text-center">
      <span className="text-xs font-semibold text-[#fd5100] uppercase tracking-widest">AMBASADORZY WBA 2026</span>
      <h2 className="mt-2 mb-4 text-3xl leading-tight md:text-4xl md:leading-tight lg:text-5xl lg:leading-tight font-bold font-heading text-white">
        Poznaj
        {' '}
        <span className="text-[#fd5100]">Ambasadorów</span>
        {' '}
        biegu
      </h2>
    </div>
    <div className="flex flex-wrap -m-4 justify-center">
      <div className="w-full md:w-1/2 lg:w-1/3 p-4">
        <a href="https://www.instagram.com/curlybrownie/" target="_blank" className="flex items-center justify-center bg-[#111111] border border-gray-800 py-12 rounded-2xl hover:border-[#fd5100] transition-colors block h-full">
          <div className="text-center">
            <img className="w-20 h-20 mx-auto rounded-full mb-6" src="plain-assets/images/gray-400-avatar.png" alt="Julia Dec" />
            <h3 className="mb-1 text-2xl font-bold font-heading text-white">Julia Dec</h3>
          </div>
        </a>
      </div>
      <div className="w-full md:w-1/2 lg:w-1/3 p-4">
        <a href="https://www.instagram.com/aa.wojciechowska2/" target="_blank" className="flex items-center justify-center bg-[#111111] border border-gray-800 py-12 rounded-2xl hover:border-[#fd5100] transition-colors block h-full">
          <div className="text-center">
            <img className="w-20 h-20 mx-auto rounded-full mb-6" src="plain-assets/images/gray-400-avatar.png" alt="Agnieszka Wojciechowska" />
            <h3 className="mb-1 text-2xl font-bold font-heading text-white">Agnieszka Wojciechowska</h3>
          </div>
        </a>
      </div>
    </div>
  </div>
</section>


    );
};

export default IndexSectionTeam8;