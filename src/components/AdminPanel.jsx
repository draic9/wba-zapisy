import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/registrations`);
        if (!res.ok) {
          throw new Error(`Bd odpowiedzi backendu: ${res.status}`);
        }
        const data = await res.json();
        setRegistrations(data);
      } catch (err) {
        console.error('Bd pobierania rejestracji w panelu admina:', err);
        setError(err.message || 'Nie udao si pobra rejestracji');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleDownloadCsv = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/registrations/export`, '_blank');
  };

  return (
    <section className="mt-12 mb-16 rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-2xl p-6 md:p-8 font-body text-zinc-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-2xl font-heading font-bold text-[#fd5100]">Panel organizatora</h2>
        <button
          onClick={handleDownloadCsv}
          className="px-4 py-2 rounded-full text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
        >
          Pobierz CSV z zapisami
        </button>
      </div>

      {loading && <p className="text-zinc-300 text-sm">Ładowanie rejestracji...</p>}
      {error && !loading && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      {!loading && !error && registrations.length === 0 && (
        <p className="text-zinc-400 text-sm">Brak rejestracji do wyświetlenia.</p>
      )}

      {!loading && !error && registrations.length > 0 && (
        <div className="overflow-x-auto mt-4 rounded-xl border border-zinc-800 bg-black/40">
          <table className="min-w-full text-sm text-left text-zinc-200">
            <thead className="bg-zinc-900/80 text-xs uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Imię i nazwisko</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Dystans</th>
                <th className="px-3 py-2">Koszulka</th>
                <th className="px-3 py-2">Status płatności</th>
                <th className="px-3 py-2">Kwota</th>
                <th className="px-3 py-2">Zapłacono</th>
                <th className="px-3 py-2">Zapisano</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr
                  key={reg.id}
                  className="border-t border-zinc-800 last:border-b-0 hover:bg-zinc-900/80 transition-colors"
                >
                  <td className="px-3 py-2 text-xs text-zinc-500">{reg.id}</td>
                  <td className="px-3 py-2">{reg.name}</td>
                  <td className="px-3 py-2 text-xs text-zinc-300">{reg.email}</td>
                  <td className="px-3 py-2">{reg.distance}</td>
                  <td className="px-3 py-2">{reg.tshirt || '-'}</td>
                  <td className="px-3 py-2 font-medium">
                    {reg.payment && reg.payment.status === 'paid' ? (
                      <span className="text-emerald-400">opłacona</span>
                    ) : (
                      <span className="text-yellow-400">oczekuje</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {reg.payment && reg.payment.amountPaid != null
                      ? `${reg.payment.amountPaid} zł`
                      : '-'}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {reg.payment && reg.payment.paidAt
                      ? new Date(reg.payment.paidAt).toLocaleString('pl-PL')
                      : '-'}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {new Date(reg.createdAt).toLocaleString('pl-PL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminPanel;
