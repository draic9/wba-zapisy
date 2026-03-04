import React, { useEffect, useState } from 'react';
import AdminPanel from '../components/AdminPanel';

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const ok = params.get('admin') === '2137';
    setIsAdmin(ok);
    setChecked(true);
  }, []);

  if (!checked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Sprawdzanie uprawnienie...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Brak dostpu</h1>
          <p className="text-gray-300 text-sm">
            Ten panel jest dostpny tylko dla organizatorw z odpowiednim linkiem.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-6xl">
        <AdminPanel />
      </div>
    </main>
  );
};

export default AdminPage;
