import { useState, useEffect } from 'react';
import billingService from '../../services/billingService';
import ConfirmModal from '../../components/ConfirmModal';

export default function BillingList() {
    const [billings, setBillings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchPatient, setSearchPatient] = useState('');
    
    // Delete Confirmation State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [billingToDelete, setBillingToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

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

    const confirmDelete = (bill) => {
        setBillingToDelete(bill);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!billingToDelete) return;
        setDeleting(true);
        try {
            await billingService.deleteBilling(billingToDelete.billingId);
            fetchBillings();
            setShowDeleteModal(false);
        } catch (err) {
            setError('Failed to delete billing record');
            console.error(err);
        } finally {
            setDeleting(false);
            setBillingToDelete(null);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <div className="flex-between" style={{ marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Billing History</h2>
                    <p className="text-muted">Manage and track patient invoices</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div style={{ background: 'var(--off-white)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '32px' }}>
                <div className="grid-2">
                    <form onSubmit={handleSearchSubmit} className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Search Patient</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="Patient ID (e.g. P-1001)..."
                                value={searchPatient}
                                onChange={(e) => setSearchPatient(e.target.value)}
                                className="form-control"
                            />
                            <button type="submit" className="btn btn-secondary">Search</button>
                        </div>
                    </form>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Payment Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="form-control"
                        >
                            <option value="ALL">All Invoices</option>
                            <option value="PENDING">Pending Payment</option>
                            <option value="PAID">Completed / Paid</option>
                            <option value="OVERDUE">Overdue Invoices</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                    ⚠️ {error}
                </div>
            )}

            {isLoading ? (
                <div style={{ padding: '80px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem' }}>🔄</div>
                    <p className="text-muted mt-2">Loading billing records...</p>
                </div>
            ) : billings.length === 0 ? (
                <div style={{ padding: '80px 40px', textAlign: 'center', background: 'var(--off-white)', borderRadius: '16px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.5 }}>🧾</div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>No records found</h3>
                    <p className="text-muted">Try adjusting your filters or search criteria.</p>
                </div>
            ) : (
                <div className="table-container" style={{ background: '#fff', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Invoice Details</th>
                                <th>Patient / Doctor</th>
                                <th>Billing Summary</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billings.map((bill) => (
                                <tr key={bill.billingId}>
                                    <td>
                                        <div style={{ fontWeight: 700, color: 'var(--primary-blue-dark)' }}>#{bill.billingId}</div>
                                        <div className="text-muted text-xs">
                                            📅 {bill.billingDate ? new Date(bill.billingDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>👤 {bill.patientId}</div>
                                        <div className="text-muted text-xs">👨‍⚕️ {bill.doctorId}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                            ${(bill.totalAmount || 0).toFixed(2)}
                                        </div>
                                        <div style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 600 }}>
                                            ⏱ Due: {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status ${bill.paymentStatus ? bill.paymentStatus.toLowerCase() : ''}`}>
                                            {bill.paymentStatus || 'UNKNOWN'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            {bill.paymentStatus === 'PENDING' && (
                                                <button
                                                    onClick={() => handleMarkAsPaid(bill.billingId)}
                                                    className="btn btn-sm btn-outline"
                                                    style={{ borderColor: 'var(--success)', color: 'var(--success)', padding: '6px 12px' }}
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                            <button
                                                onClick={() => confirmDelete(bill)}
                                                className="btn btn-sm btn-danger"
                                                style={{ padding: '6px 12px' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <ConfirmModal
                    title="Delete Billing Record"
                    message={`Are you sure you want to delete invoice #${billingToDelete?.billingId}? This will permanently remove the record.`}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                    loading={deleting}
                    type="danger"
                />
            )}
        </div>
    );
}
