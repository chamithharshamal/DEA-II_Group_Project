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
        <div style={{ padding: '24px' }}>
            <div className="modal" style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto', boxShadow: 'var(--shadow-md)' }}>
                <div className="modal-header">
                    <h2>🧾 Create New Bill</h2>
                    {onSuccess && <button type="button" className="modal-close" onClick={onSuccess}>×</button>}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="grid-3" style={{ marginBottom: '32px' }}>
                            <div className="form-group">
                                <label>Patient ID *</label>
                                <input
                                    type="text"
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                    placeholder="P-1001"
                                />
                            </div>
                            <div className="form-group">
                                <label>Doctor ID *</label>
                                <input
                                    type="text"
                                    name="doctorId"
                                    value={formData.doctorId}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                    placeholder="D-2002"
                                />
                            </div>
                            <div className="form-group">
                                <label>Appointment ID</label>
                                <input
                                    type="text"
                                    name="appointmentId"
                                    value={formData.appointmentId}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="APP-5005"
                                />
                            </div>
                        </div>

                        <div style={{ background: 'var(--off-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '20px', color: 'var(--text-primary)', fontWeight: 700 }}>💰 Fee Breakdown</h3>
                            <div className="grid-2" style={{ gap: '24px' }}>
                                <div className="form-group">
                                    <label>Consultation Fee</label>
                                    <input
                                        type="number"
                                        name="consultationFee"
                                        step="0.01" min="0"
                                        value={formData.consultationFee}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Lab Test Fee</label>
                                    <input
                                        type="number"
                                        name="labTestFee"
                                        step="0.01" min="0"
                                        value={formData.labTestFee}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Medication Fee</label>
                                    <input
                                        type="number"
                                        name="medicationFee"
                                        step="0.01" min="0"
                                        value={formData.medicationFee}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Other Fees</label>
                                    <input
                                        type="number"
                                        name="otherFee"
                                        step="0.01" min="0"
                                        value={formData.otherFee}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
                                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Total Amount:</span>
                                <div style={{ minWidth: '120px', textAlign: 'right' }}>
                                    {isCalculating ? (
                                        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Calculating...</span>
                                    ) : (
                                        <span style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--primary-blue-dark)', letterSpacing: '-0.02em' }}>
                                            ${totalPreview.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid-2">
                            <div className="form-group">
                                <label>Payment Method</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="CASH">Cash</option>
                                    <option value="CREDIT_CARD">Credit Card</option>
                                    <option value="DEBIT_CARD">Debit Card</option>
                                    <option value="INSURANCE">Insurance</option>
                                    <option value="BANK_TRANSFER">Bank Transfer</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                            <label>Remarks</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                rows="3"
                                className="form-control"
                                placeholder="Any additional notes..."
                            />
                        </div>
                    </div>

                    <div className="modal-footer" style={{ padding: '24px 32px' }}>
                        {onSuccess && (
                            <button
                                type="button"
                                onClick={onSuccess}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary"
                            style={{ minWidth: '160px' }}
                        >
                            {isSubmitting ? 'Creating...' : '🚀 Create Bill'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}