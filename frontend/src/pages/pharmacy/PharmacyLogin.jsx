import { useState } from 'react';
import pharmacyService from '../../services/pharmacyService';
import { useNavigate } from 'react-router-dom';

export default function PharmacyLogin({ setToken }) {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await pharmacyService.loginPharmacist(credentials);
            localStorage.setItem('pharmacistToken', data.token);
            setToken(data.token);
            navigate('/pharmacy');
        } catch (err) {
            console.error('Login error:', err);
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-emerald-600 p-8 text-center text-white">
                    <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">💊</span>
                    </div>
                    <h2 className="text-2xl font-bold">Pharmacy Portal</h2>
                    <p className="text-emerald-100 mt-2">Sign in to manage medications and prescriptions</p>
                </div>
                
                <div className="p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm flex items-start">
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    placeholder="pharmacist@example.com"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
