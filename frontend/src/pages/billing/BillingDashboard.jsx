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
    }, [activeTab]);

    return (
        <div>
            <div className="page-header">
                <h1>Billing & Invoices</h1>
                <p>Manage patient bills, track payments, and generate new invoices.</p>
            </div>

            {/* Stats Dashboard */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '2.5rem', background: 'var(--success-bg)', padding: '12px', borderRadius: '16px' }}>💰</div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Revenue</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {isLoading ? '...' : `$${stats.totalRevenue.toFixed(2)}`}
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '2.5rem', background: 'var(--blue-lt)', padding: '12px', borderRadius: '16px' }}>🧾</div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Bills</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {isLoading ? '...' : stats.totalBills}
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '2.5rem', background: 'var(--warning-bg)', padding: '12px', borderRadius: '16px' }}>⏳</div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending Bills</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {isLoading ? '...' : stats.pendingBills}
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '2.5rem', background: 'var(--off-white)', padding: '12px', borderRadius: '16px' }}>✅</div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Paid Bills</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {isLoading ? '...' : stats.paidBills}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button 
                    className={`admin-tab ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    All Billings
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'create' ? 'active' : ''}`}
                    onClick={() => setActiveTab('create')}
                >
                    Create New Bill
                </button>
            </div>

            {/* Content Area */}
            <div>
                {activeTab === 'list' ? (
                    <BillingList />
                ) : (
                    <BillingForm onSuccess={() => setActiveTab('list')} />
                )}
            </div>
        </div>
    );
}
