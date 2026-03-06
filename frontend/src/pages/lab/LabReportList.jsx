import React, { useState, useEffect } from 'react';
import { labReportService } from '../../services/labReportService';
import { FiSearch, FiFilter, FiCheck, FiX, FiFileText } from 'react-icons/fi';

const LabReportList = ({ statusFilter }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [testTypeFilter, setTestTypeFilter] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      let data = [];
      if (statusFilter) {
        data = await labReportService.getReportsByStatus(statusFilter);
      } else {
        data = await labReportService.getAllReports();
      }
      setReports(data || []);
    } catch (err) {
      setError('Failed to fetch lab reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      await labReportService.updateStatus(reportId, newStatus);
      fetchReports(); // Refresh list after update
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.reportId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = testTypeFilter ? report.testType === testTypeFilter : true;
    return matchesSearch && matchesType;
  });

  const testTypes = [...new Set(reports.map(r => r.testType))];

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>⏳ Loading reports...</div>;
  }

  if (error) {
    return <div style={{ padding: '16px', color: 'var(--danger)', background: 'var(--danger-bg)', borderRadius: '8px' }}>{error}</div>;
  }

  return (
    <>
      {/* Filters and Search */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', background: 'var(--off-white)', borderRadius: '12px', margin: '8px 0 24px 0' }}>
        <div className="grid-2">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Patient / Report ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search reports…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Test Category</label>
            <select
              className="form-control"
              value={testTypeFilter}
              onChange={(e) => setTestTypeFilter(e.target.value)}
            >
              <option value="">All Test Types</option>
              {testTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Patient ID</th>
              <th>Test Info</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-tertiary)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
                  No lab reports found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr key={report.reportId}>
                  <td style={{ fontWeight: 600 }}>{report.reportId}</td>
                  <td className="text-muted">{report.patientId}</td>
                  <td>
                    <div>{report.testName}</div>
                    <div className="text-muted text-xs">{report.testType}</div>
                  </td>
                  <td className="text-muted text-sm">
                    {new Date(report.reportDate).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`status ${
                      report.status === 'COMPLETED' ? 'success' :
                      report.status === 'PENDING' ? 'warning' :
                      report.status === 'IN_PROGRESS' ? 'info' :
                      'danger'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {report.status === 'PENDING' && (
                      <button
                        onClick={() => handleUpdateStatus(report.reportId, 'IN_PROGRESS')}
                        className="btn btn-sm btn-outline"
                        title="Mark In Progress"
                      >
                         <FiCheck style={{ marginRight: '4px' }}/> Start
                      </button>
                    )}
                    {report.status === 'COMPLETED' && (
                      <button
                        onClick={() => {
                          alert(`Results: ${report.results}\nNormal Range: ${report.normalRange}`);
                        }}
                        className="btn btn-sm btn-primary"
                      >
                        View Results
                      </button>
                    )}
                    {(report.status === 'PENDING' || report.status === 'IN_PROGRESS') && (
                       <button
                       onClick={() => handleUpdateStatus(report.reportId, 'CANCELLED')}
                       className="btn btn-sm btn-danger"
                       title="Cancel Test"
                     >
                        <FiX style={{ marginRight: '4px' }}/> Cancel
                     </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LabReportList;
