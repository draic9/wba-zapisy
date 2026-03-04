import React from 'react';

const IndexSectionPortfolio9 = () => {
    return (
        <section id="galeria" className="py-20 bg-black">
  <div className="container px-4 mx-auto">
    <div className="mb-16 text-center">
      <span className="text-[#fd5100] font-bold tracking-widest mb-4 block">GALERIA</span>
      <h2 className="font-heading text-5xl md:text-6xl text-white">
        <span>Poprzednie edycje</span>
        {' '}
        <span className="text-[#fd5100]">wba</span>
      </h2>
    </div>
    <div className="flex flex-wrap -mx-4">
      <div className="w-full lg:w-1/2 p-4">
        <img className="w-full h-80 object-cover rounded-lg" src="https://static.shuffle.dev/uploads/files/0f/0fd5a595c7f5312ec1e6d5781f2f8035a4e0d813/Copy-of-WBA-2023-934.jpg" alt="Bieg Akademicki" />
      </div>
      <div className="w-full lg:w-1/2 p-4">
        <img className="w-full h-80 object-cover rounded-lg" src="https://static.shuffle.dev/uploads/files/0f/0fd5a595c7f5312ec1e6d5781f2f8035a4e0d813/WBA-2024-635.jpg" alt="Uczestnicy biegu" />
      </div>
      <div className="w-full md:w-1/3 p-4">
        <img className="w-full h-80 object-cover rounded-lg" src="https://static.shuffle.dev/uploads/files/0f/0fd5a595c7f5312ec1e6d5781f2f8035a4e0d813/Copy-of-WBA-2025-148.jpg" alt="Galeria zdjęć" />
      </div>
      <div className="w-full md:w-1/3 p-4">
        <img className="w-full h-80 object-cover rounded-lg" src="https://static.shuffle.dev/uploads/files/0f/0fd5a595c7f5312ec1e6d5781f2f8035a4e0d813/Copy-of-IMG-5798.jpg" alt="Atmosfera biegu" />
      </div>
      <div className="w-full md:w-1/3 p-4">
        <img className="w-full h-80 object-cover rounded-lg" src="https://static.shuffle.dev/uploads/files/0f/0fd5a595c7f5312ec1e6d5781f2f8035a4e0d813/Copy-of-WBA-2023-28-1.jpg" alt="Finisz biegu" />
      </div>
    </div>
  </div>
</section>


    );
};

export default IndexSectionPortfolio9;