import { useState, useEffect } from 'react';
import billingService from '../../services/billingService';

export default function BillingList() {
    const [billings, setBillings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchPatient, setSearchPatient] = useState('');

    const fetchBillings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            let data = [];
            if (filterStatus === 'ALL') {
                data = await billingService.getAllBillings();
            } else {
                data = await billingService.getBillingsByPaymentStatus(filterStatus);
            }

            if (searchPatient.trim()) {
                data = data.filter(bill => 
                    bill.patientId && bill.patientId.toLowerCase().includes(searchPatient.toLowerCase())
                );
            }
            
            data.sort((a, b) => new Date(b.billingDate) - new Date(a.billingDate));
            setBillings(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch billings');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBillings();
    }, [filterStatus]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchBillings();
    };

    const handleMarkAsPaid = async (billingId) => {
        if (!window.confirm('Are you sure you want to mark this bill as PAID?')) return;
        try {
            await billingService.updatePaymentStatus(billingId, 'PAID');
            fetchBillings();
        } catch (err) {
            setError('Failed to update payment status');
            console.error(err);
        }
    };

    const handleDelete = async (billingId) => {
        if (!window.confirm('Are you sure you want to delete this bill? This action cannot be undone.')) return;
        try {
            await billingService.deleteBilling(billingId);
            fetchBillings();
        } catch (err) {
            setError('Failed to delete billing record');
            console.error(err);
        }
    };

    return (
        <div className="card" style={{ marginTop: '20px' }}>
            <div className="flex-between">
                <h2>Billing Records</h2>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            placeholder="Search Patient ID..."
                            value={searchPatient}
                            onChange={(e) => setSearchPatient(e.target.value)}
                            className="input-field"
                            style={{ width: '220px', padding: '10px 14px' }}
                        />
                        <button type="submit" className="btn btn-secondary">Search</button>
                    </form>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="input-field"
                        style={{ width: '160px', padding: '10px 14px' }}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="OVERDUE">Overdue</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {error && (
                <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginTop: '16px' }}>
                    {error}
                </div>
            )}

            {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    Loading...
                </div>
            ) : billings.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
                    <h3>No billings found</h3>
                    <p className="text-muted">Check your search/filters or create a new bill.</p>
                </div>
            ) : (
                <div className="table-container mt-4">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Bill ID / Date</th>
                                <th>Patient / Doctor</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billings.map((bill) => (
                                <tr key={bill.billingId}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{bill.billingId}</div>
                                        <div className="text-muted text-sm">
                                            {bill.billingDate ? new Date(bill.billingDate).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <div>Patient: <span style={{ fontWeight: 600 }}>{bill.patientId}</span></div>
                                        <div className="text-muted text-sm">Doctor: {bill.doctorId}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700 }}>
                                            ${(bill.totalAmount || 0).toFixed(2)}
                                        </div>
                                        <div className="text-muted text-sm">
                                            Due: {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status ${bill.paymentStatus ? bill.paymentStatus.toLowerCase() : ''}`}>
                                            {bill.paymentStatus || 'UNKNOWN'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        {bill.paymentStatus === 'PENDING' && (
                                            <button
                                                onClick={() => handleMarkAsPaid(bill.billingId)}
                                                className="btn btn-sm btn-outline"
                                                style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(bill.billingId)}
                                            className="btn btn-sm btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
