import { useState, useEffect } from 'react';
import PharmacyLogin from './PharmacyLogin';
import PharmacyDashboard from './PharmacyDashboard';

export default function PharmacyRoutes() {
  const [token, setToken] = useState(localStorage.getItem('pharmacistToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('pharmacistToken'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!token) {
    return <PharmacyLogin setToken={setToken} />;
  }

  return <PharmacyDashboard setToken={setToken} />;
}
