import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import AdminPanel from './AdminPanel';

const SignupForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    email: '',
    distance: '2.5km',
    category: 'Student',
    packageType: 'standard',
    tshirt: '',
    team: '',
    termsRegulations: false,
    termsData: false,
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setIsAdmin(params.get('admin') === '2137');
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const isFormValid = useMemo(() => {
    const {
      firstName,
      lastName,
      birthDate,
      gender,
      email,
      distance,
      category,
      packageType,
      tshirt,
      termsRegulations,
      termsData,
    } = formData;

    const hasBaseFields =
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      birthDate !== '' &&
      gender !== '' &&
      email.trim().length > 0 &&
      distance !== '' &&
      category !== '' &&
      packageType !== '';

    const hasTshirtIfNeeded =
      packageType !== 'premium' || (packageType === 'premium' && tshirt !== '');

    return hasBaseFields && hasTshirtIfNeeded && termsRegulations && termsData;
  }, [formData]);

  const handleShowRegulamin = () => {
    window.alert('Tutaj będzie treść regulaminu biegu.');
  };

  const handleShowDataInfo = () => {
    window.alert(
      'Tutaj będzie treść informacji o przetwarzaniu danych osobowych.'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
    const backendPayload = {
      name: fullName,
      email: formData.email,
      distance: formData.distance,
      tshirt:
        formData.packageType === 'premium' && formData.tshirt
          ? formData.tshirt
          : null,
      terms: formData.termsRegulations && formData.termsData,
      newsletter: false,
      birthDate: formData.birthDate,
      gender: formData.gender,
      category: formData.category,
      packageType: formData.packageType,
      team: formData.team,
    };

    console.log('Formularz wysłany (frontend) – payload do backendu:', backendPayload);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload),
      });

      if (!response.ok) {
        console.error(
          'Błąd odpowiedzi backendu:',
          response.status,
          response.statusText
        );
        alert('Wystąpił błąd po stronie serwera. Spróbuj ponownie później.');
        router.push('/zapisz-sie/blad');
        return;
      }

      const data = await response.json();
      console.log('Odpowiedź backendu:', data);

      if (data.success && data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
        router.push('/zapisz-sie/przejdz-do-platnosci');
      } else {
        console.error('Brak poprawnego paymentUrl w odpowiedzi backendu:', data);
        alert('Nie udało się przetworzyć zgłoszenia. Spróbuj ponownie.');
        router.push('/zapisz-sie/blad');
      }
    } catch (error) {
      console.error('Błąd połączenia z backendem:', error);
      alert('Nie udało się połączyć z serwerem. Upewnij się, że backend działa.');
      router.push('/zapisz-sie/blad');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: '',
      email: '',
      distance: '2.5km',
      category: 'Student',
      packageType: 'standard',
      tshirt: '',
      team: '',
      termsRegulations: false,
      termsData: false,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-8 font-body">
      <div className="w-full max-w-xl bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2 text-[#fd5100] text-center uppercase">
          Formularz zgłoszeniowy
        </h1>
        <p className="text-sm text-zinc-300 mb-6 text-center">
          Wypełnij formularz, aby zapisać się na bieg. Wszystkie pola oznaczone * są obowiązkowe.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Imię *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                maxLength={20}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#fd5100]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Nazwisko *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Data urodzenia *
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Płeć *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Wybierz</option>
                <option value="female">Kobieta</option>
                <option value="male">Mężczyzna</option>
                <option value="other">Inna / nie chcę podawać</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              E-mail *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Dystans *
              </label>
              <select
                name="distance"
                value={formData.distance}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="2.5km">2,5 km</option>
                <option value="5km">5 km</option>
                <option value="10km">10 km</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Kategoria *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="Student">Student</option>
                <option value="Open">Open</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Rodzaj pakietu *
              </label>
              <select
                name="packageType"
                value={formData.packageType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Drużyna (opcjonalne)
              </label>
              <input
                type="text"
                name="team"
                value={formData.team}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="np. Nazwa uczelni, organizacji..."
              />
            </div>
          </div>

          {formData.packageType === 'premium' && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Rozmiar koszulki (pakiet Premium) *
              </label>
              <select
                name="tshirt"
                value={formData.tshirt}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required={formData.packageType === 'premium'}
              >
                <option value="">Wybierz rozmiar</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <label className="flex items-start gap-2 text-xs text-zinc-200">
              <input
                type="checkbox"
                name="termsRegulations"
                checked={formData.termsRegulations}
                onChange={handleInputChange}
                className="mt-0.5 h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-[#fd5100] focus:ring-[#fd5100]"
                required
              />
              <span>
                Akceptuję{' '}
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    handleShowRegulamin();
                  }}
                  className="underline text-[#fd5100] hover:text-orange-300"
                >
                  regulamin biegu
                </a>
                {' '}*
              </span>
            </label>

            <label className="flex items-start gap-2 text-xs text-zinc-200">
              <input
                type="checkbox"
                name="termsData"
                checked={formData.termsData}
                onChange={handleInputChange}
                className="mt-0.5 h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-[#fd5100] focus:ring-[#fd5100]"
                required
              />
              <span>
                Wyrażam zgodę na przetwarzanie danych osobowych w celu organizacji biegu *
              </span>
            </label>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              Wyczyść formularz
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              style={{ backgroundColor: isFormValid ? '#fd5100' : '#3f3f46' }}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-150 flex items-center justify-center gap-2 ${
                isFormValid && !isSubmitting
                  ? 'text-white hover:opacity-90'
                  : 'text-zinc-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Przetwarzanie...</span>
                </>
              ) : (
                'Zapisz się'
              )}
            </button>
          </div>
        </form>
      </div>

      {isAdmin && (
        <div className="w-full max-w-5xl mt-8">
          <AdminPanel />
        </div>
      )}
    </div>
  );
};

export default SignupForm;
