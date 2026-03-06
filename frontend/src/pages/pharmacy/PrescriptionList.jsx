import { useState, useEffect } from 'react';
import pharmacyService from '../../services/pharmacyService';

export default function PrescriptionList({ refreshStats }) {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'dispensed'
    const [patientSearch, setPatientSearch] = useState('');

    useEffect(() => {
        loadPrescriptions();
    }, [filter]);

    const loadPrescriptions = async () => {
        setLoading(true);
        try {
            let data = [];
            if (patientSearch) {
                if (filter === 'pending') {
                    data = await pharmacyService.getPendingPrescriptions(patientSearch);
                } else {
                    data = await pharmacyService.getPrescriptionsByPatient(patientSearch);
                }
            } else {
                data = await pharmacyService.getPrescriptions();
                if (filter === 'pending') {
                    data = data.filter(p => !p.dispensed);
                } else if (filter === 'dispensed') {
                    data = data.filter(p => p.dispensed);
                }
            }
            // Sort by date descending
            data.sort((a, b) => new Date(b.prescribedDate) - new Date(a.prescribedDate));
            setPrescriptions(data);
            if (refreshStats) refreshStats();
        } catch (error) {
            console.error("Failed to load prescriptions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadPrescriptions();
    };

    const handleDispense = async (id) => {
        if (window.confirm("Confirm dispensing medications for this prescription? This will deduct from stock.")) {
            try {
                await pharmacyService.dispensePrescription(id);
                await loadPrescriptions();
                alert("Prescription dispensed successfully!");
            } catch (error) {
                console.error("Failed to dispense", error);
                const msg = error.response?.data?.message || "Error dispensing. Please check stock levels.";
                alert(msg);
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Prescription Queue</h3>
                
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div className="admin-tabs" style={{ display: 'flex', gap: '4px' }}>
                        <button 
                            onClick={() => setFilter('all')}
                            className={`admin-tab ${filter === 'all' ? 'active' : ''}`}
                            style={{ padding: '6px 16px', fontSize: '0.9rem' }}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilter('pending')}
                            className={`admin-tab ${filter === 'pending' ? 'active' : ''}`}
                            style={{ padding: '6px 16px', fontSize: '0.9rem' }}
                        >
                            Pending
                        </button>
                        <button 
                            onClick={() => setFilter('dispensed')}
                            className={`admin-tab ${filter === 'dispensed' ? 'active' : ''}`}
                            style={{ padding: '6px 16px', fontSize: '0.9rem' }}
                        >
                            Dispensed
                        </button>
                    </div>

                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            placeholder="Patient ID..."
                            value={patientSearch}
                            onChange={(e) => setPatientSearch(e.target.value)}
                            className="input-field"
                            style={{ minWidth: '200px' }}
                        />
                        <button type="submit" className="btn btn-outline" title="Search">
                            🔍
                        </button>
                    </form>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>⏳ Loading prescriptions...</div>
            ) : (
                <div className="grid-2">
                    {prescriptions.map((prescription) => (
                        <div 
                            key={prescription.id} 
                            style={{ 
                                background: '#fff', 
                                padding: '24px', 
                                borderRadius: '12px', 
                                border: '1px solid var(--border)',
                                borderLeft: `4px solid ${prescription.dispensed ? 'var(--primary-blue)' : 'var(--warning)'}`,
                                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 6px -1px'
                            }}
                        >
                            <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>RX #{prescription.id}</h4>
                                        <span className={`status ${prescription.dispensed ? 'info' : 'warning'}`}>
                                            {prescription.dispensed ? 'DISPENSED' : 'PENDING'}
                                        </span>
                                    </div>
                                    <p className="text-muted text-sm" style={{ margin: 0 }}>
                                        Date: {new Date(prescription.prescribedDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ background: 'var(--off-white)', padding: '4px 12px', borderRadius: 'var(--radius-pill)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                        Patient: {prescription.patientId}
                                    </div>
                                    <div className="text-muted text-xs font-mono">
                                        Doc: {prescription.doctorId}
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'var(--off-white)', borderRadius: '8px', padding: '16px', marginBottom: '16px', border: '1px solid var(--border)' }}>
                                <h5 style={{ margin: '0 0 8px 0', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Prescribed Medications
                                </h5>
                                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {prescription.medications && prescription.medications.map((med, idx) => (
                                        <li key={idx} className="flex-between text-sm">
                                            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                                                {med.medicationName || `Medication ID: ${med.id}`}
                                            </span>
                                            <span style={{ background: '#fff', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--text-tertiary)', fontSize: '0.8rem', fontWeight: 600 }}>
                                                Qty: {med.quantity}
                                            </span>
                                        </li>
                                    ))}
                                    {(!prescription.medications || prescription.medications.length === 0) && (
                                        <li className="text-muted text-sm" style={{ fontStyle: 'italic' }}>No medications listed.</li>
                                    )}
                                </ul>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                {!prescription.dispensed ? (
                                    <button
                                        onClick={() => handleDispense(prescription.id)}
                                        className="btn btn-primary"
                                        style={{ background: 'var(--success)' }}
                                    >
                                        ✓ Dispense Order
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="btn btn-outline"
                                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                    >
                                        🔒 Completed
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {prescriptions.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: 'var(--text-tertiary)', background: 'var(--off-white)', borderRadius: '12px', border: '2px dashed var(--border)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
                            No prescriptions found matching the current criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
