// import { useState } from 'react';
// import pharmacyService from '../../services/pharmacyService';
// import { useNavigate } from 'react-router-dom';

// export default function PharmacyLogin({ setToken }) {
//     const [credentials, setCredentials] = useState({ email: '', password: '' });
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setCredentials({ ...credentials, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setLoading(true);

//         try {
//             const data = await pharmacyService.loginPharmacist(credentials);
//             localStorage.setItem('pharmacistToken', data.token);
//             setToken(data.token);
//             navigate('/pharmacy');
//         } catch (err) {
//             console.error('Login error:', err);
//             setError('Invalid email or password. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex h-screen items-center justify-center bg-gray-50">
//             <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
//                 <div className="bg-emerald-600 p-8 text-center text-white">
//                     <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
//                         <span className="text-3xl">💊</span>
//                     </div>
//                     <h2 className="text-2xl font-bold">Pharmacy Portal</h2>
//                     <p className="text-emerald-100 mt-2">Sign in to manage medications and prescriptions</p>
//                 </div>
                
//                 <div className="p-8">
//                     {error && (
//                         <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm flex items-start">
//                             <span>{error}</span>
//                         </div>
//                     )}
                    
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
//                             <div className="relative">
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     value={credentials.email}
//                                     onChange={handleChange}
//                                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
//                                     placeholder="pharmacist@example.com"
//                                     required
//                                 />
//                             </div>
//                         </div>
                        
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//                             <div className="relative">
//                                 <input
//                                     type="password"
//                                     name="password"
//                                     value={credentials.password}
//                                     onChange={handleChange}
//                                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
//                                     placeholder="••••••••"
//                                     required
//                                 />
//                             </div>
//                         </div>
                        
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className={`w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
//                         >
//                             {loading ? 'Signing in...' : 'Sign In'}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }


// ─── Pharmacy Login Page ──────────────────────────────────────────────────────
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
        <div style={{
            minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <div style={{
                background: '#fff', borderRadius: 16, padding: '40px 48px',
                boxShadow: '0 4px 32px rgba(5,150,105,0.10)', width: '100%', maxWidth: 420,
                border: '1px solid #d1fae5',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 56, height: 56, background: 'linear-gradient(135deg, #059669, #34d399)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', fontSize: 24,
                    }}>💊</div>
                    <h2 style={{ margin: 0, color: '#064e3b', fontSize: '1.5rem', fontWeight: 700 }}>Pharmacy Portal</h2>
                    <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.875rem' }}>
                        Sign in to manage medications and prescriptions
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 8,
                        padding: '10px 14px', marginBottom: 20, color: '#991b1b', fontSize: '0.85rem',
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            className="form-control"
                            type="email"
                            name="email"
                            required
                            placeholder="pharmacist@example.com"
                            value={credentials.email}
                            onChange={handleChange}
                            autoComplete="username"
                        />
                    </div>
                    <div className="form-group" style={{ marginTop: 16 }}>
                        <label>Password</label>
                        <input
                            className="form-control"
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', marginTop: 24, padding: '12px', fontSize: '1rem' }}
                    >
                        {loading ? 'Signing in…' : 'Sign In →'}
                    </button>
                </form>
            </div>
        </div>
    );
}