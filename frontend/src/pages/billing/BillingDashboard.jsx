import { useState, useEffect } from 'react';
import billingService from '../../services/billingService';
import BillingList from './BillingList';
import BillingForm from './BillingForm';

export default function BillingDashboard() {
    const [stats, setStats] = useState({
        totalBills: 0,
        pendingBills: 0,
        paidBills: 0,
        totalRevenue: 0
    });
    const [activeTab, setActiveTab] = useState('list');
    const [isLoading, setIsLoading] = useState(true);

    const loadStats = async () => {
        setIsLoading(true);
        try {
            const billings = await billingService.getAllBillings();
            
            let pendingCount = 0;
            let paidCount = 0;
            let revenue = 0;

            billings.forEach(bill => {
                if (bill.paymentStatus === 'PENDING') {
                    pendingCount++;
                } else if (bill.paymentStatus === 'PAID') {
                    paidCount++;
                    revenue += (bill.totalAmount || 0);
                }
            });

            setStats({
                totalBills: billings.length,
                pendingBills: pendingCount,
                paidBills: paidCount,
                totalRevenue: revenue
            });
        } catch (error) {
            console.error('Error loading billing stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, [activeTab]); // Reload stats when switching tabs (i.e. returning to list after create)

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900 border-l-4 border-purple-500 pl-3">
                                Billing Module
                            </h1>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <span className="text-2xl">ð°</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? '-' : `$${stats.totalRevenue.toFixed(2)}`}
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <span className="text-2xl">ð§¾</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Bills</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? '-' : stats.totalBills}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-red-50 rounded-lg">
                            <span className="text-2xl">â³</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? '-' : stats.pendingBills}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <span className="text-2xl">â</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Paid Bills</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? '-' : stats.paidBills}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6 bg-white rounded-t-xl px-4 pt-4 shadow-sm">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`${
                                activeTab === 'list'
                                    ? 'border-purple-500 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                        >
                            All Billings
                        </button>
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`${
                                activeTab === 'create'
                                    ? 'border-purple-500 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                        >
                            Create New Bill
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-gray-100 min-h-[500px]">
                    {activeTab === 'list' ? (
                        <BillingList />
                    ) : (
                        <BillingForm onSuccess={() => setActiveTab('list')} />
                    )}
                </div>
            </div>
        </div>
    );
}
