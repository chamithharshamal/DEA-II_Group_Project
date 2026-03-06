import { useState, useEffect } from 'react';
import pharmacyService from '../../services/pharmacyService';
import MedicationList from './MedicationList';
import PrescriptionList from './PrescriptionList';

export default function PharmacyDashboard() {
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

    return (
        <div className="card" style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
            {/* Header */}
            <div className="flex-between mb-4 mt-2" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        💊 Pharmacy Portal
                    </h1>
                    <p>Manage medication inventory and patient prescriptions.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid-3" style={{ marginBottom: '24px' }}>
                <div style={{ background: 'var(--off-white)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'var(--primary-blue-light)', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                        📦
                    </div>
                    <div>
                        <div className="text-muted text-sm" style={{ fontWeight: 600 }}>Total Medications</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalMedications}</div>
                    </div>
                </div>

                <div style={{ background: 'var(--off-white)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'var(--danger)', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                        ⚠️
                    </div>
                    <div>
                        <div className="text-muted text-sm" style={{ fontWeight: 600 }}>Low Stock Alerts</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--danger)' }}>{stats.lowStock}</div>
                    </div>
                </div>

                <div style={{ background: 'var(--off-white)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'var(--warning)', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                        📄
                    </div>
                    <div>
                        <div className="text-muted text-sm" style={{ fontWeight: 600 }}>Pending Prescriptions</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.pendingPrescriptions}</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-tabs" style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
                <button
                    onClick={() => setActiveTab('medications')}
                    className={`admin-tab ${activeTab === 'medications' ? 'active' : ''}`}
                >
                    Medication Inventory
                </button>
                <button
                    onClick={() => setActiveTab('prescriptions')}
                    className={`admin-tab ${activeTab === 'prescriptions' ? 'active' : ''}`}
                >
                    Prescriptions
                </button>
            </div>

            {/* Content Area */}
            <div>
                {activeTab === 'medications' ? (
                    <MedicationList refreshStats={loadStats} />
                ) : (
                    <PrescriptionList refreshStats={loadStats} />
                )}
            </div>
        </div>
    );
}
