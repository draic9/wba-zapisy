import React, { useState } from 'react';

const IndexSectionCustomComponents4 = () => {
    const faqs = [
        {
            question: 'Jak wygląda odbiór pakietów startowych?',
            answer: (
                <>
                    Odbiór pakietów będzie możliwy w dniach:
                    <br />
                    28.05.2026 r. w godzinach 10:00-16:00
                    <br />
                    29.05.2026 r. w godzinach 10:00-19:00
                    <br />
                    na terenie Uniwestytetu Ekonomicznego we Wrocławiu (organizator poinformuje o dokładnym miejscu odbioru pakietów oraz w dniu wydarzenia, 31.05.2026 r. w Biurze Zawodów na terenie Parku Grabiszyńskiego
                </>
            ),
        },
        {
            question: 'Jak wygląda harmonogram wydarzenia?',
            answer: 'Dokładny harmonogram wydarzenia będzie udostępniony na stronie Wrocławskiego Biegu Akademickiego, jak i na social mediach wydarzenia bliżej daty biegu!',
        },
        {
            question: 'O której zaczyna się mój dystans?',
            answer: (
                <>
                    10:00 - start biegu na 10km
                    <br />
                    12:15 - start biegu na 5km
                    <br />
                    14:00 - start biegu "Fun Run"
                </>
            ),
        },
        {
            question: 'Czy można odebrać pakiet w dniu wydarzenia?',
            answer: 'Weryfikacja zawodników oraz wydawanie numerów startowych odbywać się będzie w dniu wydarzenia od 8:30 do 13:30. Niestawienie się uczestnika w wyznaczonym czasie skutkuje dyskwalifikacją z biegu.',
        },
        {
            question: 'Czy można zapisać się na bieg będąc niepełnoletnim?',
            answer: 'Tak, w biegu mogą brać udział osoby poniżej 18 roku życia, gdy dostarczą one pisemną zgodę od opiekuna prawnego (załącznik nr 2 do Regulaminu).',
            defaultOpen: true,
        },
        {
            question: 'Gdzie mogę zostawić swoje rzeczy na czas biegu?',
            answer: 'Na terenie miasteczka biegowego, będzie znajdować się namiot z depozytem, w którym uczestnicy biegu mogą zostawiać swoje rzeczy osobiste. Odbiór rzeczy z depozytu będzie możliwy na podstawie okazanego numeru startowego.',
        },
        {
            question: 'Czy ktoś może za mnie odebrać pakiet startowy?',
            answer: 'Tak, jeśli taka osoba posiada pisemne upoważnienie od osoby, dla której planuje odebrać pakiet startowy.',
        },
        {
            question: 'Czy mogę zrezygnować i dostać zwrot pieniędzy?',
            answer: 'Niestety rezygnacja z biegu po opłaceniu nie jest możliwa. Można jednak przekazać swoje miejsce na liście startowej innej osobie w terminie do dnia 29.05.2026 r., do godz. 16:00, informując o tym organizatorów na adres bieg.wroclawski.wba@gmail.com. Natomiast organizator nie gwarantuje zmiany danych osobowych w systemie pomiaru czasu.',
        },
        {
            question: 'Czy jest możliwość kupna koszulek i materiałów promocyjnych WBA podczas biegu?',
            answer: 'Tak, w miasteczku biegowym będzie dostępny sklepik WBA, w którym będzie można zakupić koszulki, torby itp. z tegorocznej oraz poprzednich edycji wydarzenia. Serdecznie zapraszamy!',
        },
        {
            question: 'Co znajduje się w danym pakiecie startowym?',
            answer: (
                <>
                    Na Pakiet Standard składa się: pamiątkowy medal i numer startowy wraz z przymocowanym chipem oraz torba bawełniana.
                    <br />
                    Na Pakiet Premium składa się: pamiątkowy medal i numer startowy wraz z przymocowanym chipem, torba bawełniana, koszulka biegowa, skarpety oraz dodatki od partnerów wydarzenia.
                </>
            ),
        },
    ];

    const defaultIndex = faqs.findIndex((faq) => faq.defaultOpen);
    const [openIndex, setOpenIndex] = useState(defaultIndex === -1 ? null : defaultIndex);

    const handleToggle = (index) => {
        setOpenIndex((current) => (current === index ? null : index));
    };

    return (
        <section id="faq" className="bg-black py-24 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-[#fd5100] font-bold tracking-widest mb-4 block">FAQ</span>
                    <h2 className="font-heading text-5xl md:text-6xl text-white">
                        <span>NAJCZĘŚCIEJ ZADAWANE</span>
                        {' '}
                        <span className="text-[#fd5100]">PYTANIA</span>
                    </h2>
                </div>
                <div className="space-y-4 faq-accordion">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={faq.question}
                                className="faq-item border border-gray-800 rounded-2xl overflow-hidden"
                            >
                                <button
                                    type="button"
                                    className="faq-trigger w-full flex items-center justify-between p-6 text-left bg-[#111111] hover:bg-[#1a1a1a] transition-colors"
                                    onClick={() => handleToggle(index)}
                                >
                                    <span className="text-white font-bold text-lg">{faq.question}</span>
                                    <svg
                                        className={`faq-icon w-6 h-6 text-[#fd5100] transform transition-transform ${
                                            isOpen ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                <div
                                    className={`faq-content overflow-hidden transition-opacity duration-400 ease-in-out ${
                                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="p-6 pt-0 text-gray-400 bg-[#111111]">{faq.answer}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default IndexSectionCustomComponents4;