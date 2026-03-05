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

    // Auto-calculate the total whenever fee inputs change
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

        // Add a small debounce or compute immediately since it's just a quick API call
        const timeoutId = setTimeout(() => {
            calculateTotal();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [formData.consultationFee, formData.labTestFee, formData.medicationFee, formData.otherFee]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Basic validation
        if (!formData.patientId || !formData.doctorId) {
            setError('Patient ID and Doctor ID are required.');
            setIsSubmitting(false);
            return;
        }

        try {
            await billingService.createBilling(formData);
            if (onSuccess) onSuccess(); // Return to list view
        } catch (err) {
            setError(err.message || 'Failed to create billing record');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Bill</h2>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Patient & Appointment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID *</label>
                            <input
                                type="text"
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor ID *</label>
                            <input
                                type="text"
                                name="doctorId"
                                value={formData.doctorId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment ID</label>
                            <input
                                type="text"
                                name="appointmentId"
                                value={formData.appointmentId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Fee Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee ($)</label>
                            <input
                                type="number"
                                name="consultationFee"
                                step="0.01"
                                min="0"
                                value={formData.consultationFee}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lab Test Fee ($)</label>
                            <input
                                type="number"
                                name="labTestFee"
                                step="0.01"
                                min="0"
                                value={formData.labTestFee}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Medication Fee ($)</label>
                            <input
                                type="number"
                                name="medicationFee"
                                step="0.01"
                                min="0"
                                value={formData.medicationFee}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Other Fees ($)</label>
                            <input
                                type="number"
                                name="otherFee"
                                step="0.01"
                                min="0"
                                value={formData.otherFee}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end items-center">
                        <span className="text-gray-500 mr-4">Preview Total:</span>
                        {isCalculating ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                        ) : (
                            <span className="text-3xl font-bold text-gray-900">${totalPreview.toFixed(2)}</span>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment & Logistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                            >
                                <option value="CASH">Cash</option>
                                <option value="CREDIT_CARD">Credit Card</option>
                                <option value="DEBIT_CARD">Debit Card</option>
                                <option value="INSURANCE">Insurance</option>
                                <option value="BANK_TRANSFER">Bank Transfer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Any additional notes..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={() => { if(onSuccess) onSuccess(); }}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                            isSubmitting ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Bill'}
                    </button>
                </div>
            </form>
        </div>
    );
}