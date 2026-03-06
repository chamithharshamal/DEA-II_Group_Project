import { useState, useEffect } from 'react';
import billingService from '../../services/billingService';

export default function BillingForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        appointmentId: '',
        patientId: '',
        doctorId: '',
        consultationFee: 0,
        labTestFee: 0,
        medicationFee: 0,
        otherFee: 0,
        paymentMethod: 'CASH',
        dueDate: '',
        remarks: ''
    });

    const [totalPreview, setTotalPreview] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('Fee') ? parseFloat(value) || 0 : value
        }));
    };

    useEffect(() => {
        const calculateTotal = async () => {
            setIsCalculating(true);
            try {
                const total = await billingService.calculateTotalAmount(
                    formData.consultationFee,
                    formData.labTestFee,
                    formData.medicationFee,
                    formData.otherFee
                );
                setTotalPreview(total);
            } catch (err) {
                console.error("Failed to calculate total", err);
            } finally {
                setIsCalculating(false);
            }
        };

        const timeoutId = setTimeout(() => {
            calculateTotal();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [formData.consultationFee, formData.labTestFee, formData.medicationFee, formData.otherFee]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!formData.patientId || !formData.doctorId) {
            setError('Patient ID and Doctor ID are required.');
            setIsSubmitting(false);
            return;
        }

        try {
            await billingService.createBilling(formData);
            if (onSuccess) onSuccess(); 
        } catch (err) {
            setError(err.message || 'Failed to create billing record');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card" style={{ marginTop: '20px', maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '24px' }}>Create New Bill</h2>

            {error && (
                <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* Patient / Appointment */}
                <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--primary-blue-dark)' }}>Patient & Appointment Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div>
                            <label>Patient ID *</label>
                            <input
                                type="text"
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label>Doctor ID *</label>
                            <input
                                type="text"
                                name="doctorId"
                                value={formData.doctorId}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label>Appointment ID</label>
                            <input
                                type="text"
                                name="appointmentId"
                                value={formData.appointmentId}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>

                {/* Fee Breakdown */}
                <div style={{ background: 'var(--off-white)', padding: '24px', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--primary-blue-dark)' }}>Fee Breakdown</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div>
                            <label>Consultation Fee ($)</label>
                            <input
                                type="number"
                                name="consultationFee"
                                step="0.01" min="0"
                                value={formData.consultationFee}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label>Lab Test Fee ($)</label>
                            <input
                                type="number"
                                name="labTestFee"
                                step="0.01" min="0"
                                value={formData.labTestFee}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label>Medication Fee ($)</label>
                            <input
                                type="number"
                                name="medicationFee"
                                step="0.01" min="0"
                                value={formData.medicationFee}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label>Other Fees ($)</label>
                            <input
                                type="number"
                                name="otherFee"
                                step="0.01" min="0"
                                value={formData.otherFee}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
                        <span className="text-muted" style={{ fontWeight: 600 }}>Preview Total:</span>
                        {isCalculating ? (
                            <span className="text-muted">Calculating...</span>
                        ) : (
                            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                ${totalPreview.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Logistics */}
                <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--primary-blue-dark)' }}>Payment & Logistics</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div>
                            <label>Payment Method</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="CASH">Cash</option>
                                <option value="CREDIT_CARD">Credit Card</option>
                                <option value="DEBIT_CARD">Debit Card</option>
                                <option value="INSURANCE">Insurance</option>
                                <option value="BANK_TRANSFER">Bank Transfer</option>
                            </select>
                        </div>
                        <div>
                            <label>Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label>Remarks</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                rows="3"
                                className="input-field"
                                placeholder="Any additional notes..."
                                style={{ resize: 'vertical' }}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
                    <button
                        type="button"
                        onClick={() => { if(onSuccess) onSuccess(); }}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Bill'}
                    </button>
                </div>
            </form>
        </div>
    );
}