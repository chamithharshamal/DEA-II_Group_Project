import { useState, useEffect } from 'react';
import pharmacyService from '../../services/pharmacyService';
import MedicationList from './MedicationList';
import PrescriptionList from './PrescriptionList';

export default function PharmacyDashboard({ setToken }) {
    const [activeTab, setActiveTab] = useState('medications');
    const [stats, setStats] = useState({
        totalMedications: 0,
        lowStock: 0,
        pendingPrescriptions: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const medications = await pharmacyService.getMedications();
            const lowStockMeds = await pharmacyService.getLowStock(20);
            
            // Getting pending prescriptions requires passing patientId currently, or extending the backend.
            // For now, let's just show total prescriptions as a proxy since we don't have a get all pending route yet without patientId.
            // Actually, we do have getAllPrescriptions. Let's filter them.
            const allPrescriptions = await pharmacyService.getPrescriptions();
            const pending = allPrescriptions.filter(p => !p.dispensed).length;

            setStats({
                totalMedications: medications.length,
                lowStock: lowStockMeds.length,
                pendingPrescriptions: pending
            });
        } catch (error) {
            console.error("Failed to load pharmacy stats", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('pharmacistToken');
        setToken(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-emerald-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl mr-2">💊</span>
                            <span className="font-bold text-xl tracking-tight">Pharmacy Portal</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-emerald-100 text-sm hidden sm:block">
                                Pharmacist Session Active
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-emerald-500"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
                        <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
                            📦
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Medications</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalMedications}</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
                        <div className="p-3 rounded-full bg-red-50 text-red-600 mr-4">
                            ⚠️
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
                            <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
                        <div className="p-3 rounded-full bg-yellow-50 text-yellow-600 mr-4">
                            📄
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending Prescriptions</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingPrescriptions}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('medications')}
                            className={`flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none transition-colors ${
                                activeTab === 'medications' 
                                    ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50/50' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Medication Inventory
                        </button>
                        <button
                            onClick={() => setActiveTab('prescriptions')}
                            className={`flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none transition-colors ${
                                activeTab === 'prescriptions' 
                                    ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50/50' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Prescriptions
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
                    {activeTab === 'medications' ? (
                        <MedicationList refreshStats={loadStats} />
                    ) : (
                        <PrescriptionList refreshStats={loadStats} />
                    )}
                </div>
            </div>
        </div>
    );
}
