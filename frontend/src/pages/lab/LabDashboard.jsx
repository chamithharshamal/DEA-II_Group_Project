import React, { useState } from 'react';
import { labReportService } from '../../services/labReportService';
import LabReportList from './LabReportList';
import LabReportForm from './LabReportForm';

const LabDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'completed', 'new'
  const user = labReportService.getCurrentUser();

  return (
    <div className="card" style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      
      {/* Premium Header */}
      <div className="flex-between mb-4 mt-2" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            🔬 Lab Services
          </h1>
          <p>Manage and process patient laboratory testing and reports.</p>
        </div>
      </div>

      {/* Admin Style Tabs */}
      <div className="admin-tabs" style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('pending')}
          className={`admin-tab ${activeTab === 'pending' ? 'active' : ''}`}
        >
          Pending Tests
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`admin-tab ${activeTab === 'completed' ? 'active' : ''}`}
        >
          Completed Tests
        </button>
        <button
          onClick={() => setActiveTab('new')}
          className={`admin-tab ${activeTab === 'new' ? 'active' : ''}`}
          style={{ marginLeft: 'auto', background: activeTab === 'new' ? 'var(--primary-blue)' : 'var(--off-white)', color: activeTab === 'new' ? '#fff' : 'var(--primary-blue)', fontWeight: 700 }}
        >
          + Create Request
        </button>
      </div>

      {/* Dynamic Content Area */}
      <div>
        {activeTab === 'pending' && <LabReportList statusFilter="PENDING" />}
        {activeTab === 'completed' && <LabReportList statusFilter="COMPLETED" />}
        {activeTab === 'new' && <LabReportForm onSuccess={() => setActiveTab('pending')} />}
      </div>
    </div>
  );
};

export default LabDashboard;
