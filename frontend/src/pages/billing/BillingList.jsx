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

            // Apply client-side patient search filter if not empty
            if (searchPatient.trim()) {
                data = data.filter(bill => 
                    bill.patientId && bill.patientId.toLowerCase().includes(searchPatient.toLowerCase())
                );
            }
            
            // Sort by most recent billing date, descending
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
    }, [filterStatus]); // Re-fetch when status filter changes

    // Update manually when search changes to avoid excessive API calls
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchBillings();
    };

    const handleMarkAsPaid = async (billingId) => {
        if (!window.confirm('Are you sure you want to mark this bill as PAID?')) return;
        try {
            await billingService.updatePaymentStatus(billingId, 'PAID');
            fetchBillings(); // Refresh list
        } catch (err) {
            setError('Failed to update payment status');
            console.error(err);
        }
    };

    const handleDelete = async (billingId) => {
        if (!window.confirm('Are you sure you want to delete this bill? This action cannot be undone.')) return;
        try {
            await billingService.deleteBilling(billingId);
            fetchBillings(); // Refresh list
        } catch (err) {
            setError('Failed to delete billing record');
            console.error(err);
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                <h2 className="text-xl font-semibold text-gray-800">Billing Records</h2>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    {/* Search by Patient */}
                    <form onSubmit={handleSearchSubmit} className="flex">
                        <input
                            type="text"
                            placeholder="Search by Patient ID..."
                            value={searchPatient}
                            onChange={(e) => setSearchPatient(e.target.value)}
                            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button 
                            type="submit"
                            className="bg-gray-100 px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 text-gray-700"
                        >
                            Search
                        </button>
                    </form>

                    {/* Filter by Status */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700"
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
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
            ) : billings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-4xl block mb-3">ð­</span>
                    <h3 className="text-lg font-medium text-gray-900">No billings found</h3>
                    <p className="text-gray-500 mt-1">Check your search/filters or create a new bill.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bill ID / Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Patient / Doctor
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {billings.map((bill) => (
                                <tr key={bill.billingId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{bill.billingId}</div>
                                        <div className="text-sm text-gray-500">
                                            {bill.billingDate ? new Date(bill.billingDate).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">Patient: <span className="font-medium">{bill.patientId}</span></div>
                                        <div className="text-sm text-gray-500">Doctor: {bill.doctorId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">
                                            ${(bill.totalAmount || 0).toFixed(2)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Due: {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${bill.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 
                                              bill.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                                              bill.paymentStatus === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                                              'bg-gray-100 text-gray-800'}`}>
                                            {bill.paymentStatus || 'UNKNOWN'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {bill.paymentStatus === 'PENDING' && (
                                            <button
                                                onClick={() => handleMarkAsPaid(bill.billingId)}
                                                className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors mr-3"
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(bill.billingId)}
                                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
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
