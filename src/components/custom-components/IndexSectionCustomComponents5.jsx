import React, { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const IndexSectionCustomComponents5 = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        setStatus('error');
        return;
      }

      const data = await res.json();
      if (data && data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Błąd wysyłki formularza kontaktowego:', err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
        <section id="kontakt" className="bg-[#111111] py-24 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-16">
      <div>
        <span className="text-[#fd5100] font-bold tracking-widest mb-4 block">KONTAKT</span>
        <h2 className="font-heading text-5xl md:text-6xl text-white mb-6">
          <span>MASZ</span>
          {' '}
          <span className="text-[#fd5100]">PYTANIA?</span>
        </h2>
        <p className="text-gray-400 text-lg mb-8">Skontaktuj się z nami! Nasz zespół chętnie odpowie na wszystkie pytania dotyczące biegu, rejestracji czy wolontariatu.</p>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#fd5100]/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#fd5100]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Email</div>
              <a href="mailto:wroclawskibiegakademicki@gmail.com" className="text-white text-lg hover:text-[#fd5100] transition-colors">bieg.wroclawski.wba@gmail.com</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black/50 rounded-3xl p-8">
        <h3 className="text-white font-heading font-bold text-2xl mb-6">Napisz do nas</h3>
        <form className="space-y-4 font-body" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Imię i nazwisko"
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fd5100] transition-colors"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Adres email"
              required
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fd5100] transition-colors"
            />
          </div>
          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Twoja wiadomość"
              rows={4}
              required
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#fd5100] transition-colors resize-none"
            />
          </div>

          {status === 'success' && (
            <p className="text-sm text-emerald-400">
              Dziękujemy za wiadomość! Odezwiemy się tak szybko, jak to możliwe.
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-400">
              Coś poszło nie tak przy wysyłaniu wiadomości. Spróbuj ponownie później.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#fd5100] text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Wysyłanie...</span>
              </>
            ) : (
              'WYŚLIJ WIADOMOŚĆ'
            )}
          </button>
        </form>
      </div>
    </div>
  </div>
</section>


    );
};

export default IndexSectionCustomComponents5;