import React, { useState, useEffect } from 'react';
import { labReportService } from '../../services/labReportService';

const LabReportForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    testName: '',
    testType: 'BLOOD_TEST',
    doctorId: '',
    notes: ''
  });
  
  // Results submission state
  const [activeReportId, setActiveReportId] = useState('');
  const [resultsData, setResultsData] = useState({
    results: '',
    normalRange: ''
  });

  const [inProgressReports, setInProgressReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchInProgressReports();
  }, []);

  const fetchInProgressReports = async () => {
    try {
      const reports = await labReportService.getReportsByStatus('IN_PROGRESS');
      setInProgressReports(reports || []);
    } catch (err) {
      console.error("Could not fetch in-progress reports", err);
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResultsChange = (e) => {
    const { name, value } = e.target;
    setResultsData(prev => ({ ...prev, [name]: value }));
  };

  const submitNewReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg('');
    try {
      await labReportService.createReport(formData);
      setSuccessMsg('Test request created successfully.');
      setFormData({
        patientId: '',
        testName: '',
        testType: 'BLOOD_TEST',
        doctorId: '',
        notes: ''
      });
      if (onSuccess) {
        setTimeout(onSuccess, 1500); // Allow time to see success message
      }
    } catch (err) {
      setError('Failed to create new test request.');
    } finally {
      setLoading(false);
    }
  };

  const submitTestResults = async (e) => {
    e.preventDefault();
    if (!activeReportId) {
      setError('Please select a report to add results to.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMsg('');
    try {
      await labReportService.submitResults(activeReportId, resultsData.results, resultsData.normalRange);
      setSuccessMsg('Results submitted successfully!');
      setResultsData({ results: '', normalRange: '' });
      setActiveReportId('');
      fetchInProgressReports();
    } catch (err) {
      setError('Failed to submit results.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {error && (
        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <strong>Error: </strong> {error}
        </div>
      )}
      
      {successMsg && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          {successMsg}
        </div>
      )}

      <div className="grid-2" style={{ alignItems: 'flex-start', gap: '32px' }}>
        {/* Create New Test Request Form */}
        <div className="modal" style={{ position: 'relative', width: '100%', maxWidth: 'none', margin: 0, boxShadow: 'var(--shadow-md)' }}>
          <div className="modal-header">
            <h2 style={{ fontSize: '1.25rem' }}>+ Create Test Request</h2>
          </div>
          
          <form onSubmit={submitNewReport}>
            <div className="modal-body">
              <div className="grid-2">
                <div className="form-group">
                  <label>Patient ID *</label>
                  <input
                    type="text"
                    name="patientId"
                    required
                    value={formData.patientId}
                    onChange={handleCreateChange}
                    className="form-control"
                    placeholder="P-1001"
                  />
                </div>

                <div className="form-group">
                  <label>Doctor ID *</label>
                  <input
                    type="text"
                    name="doctorId"
                    required
                    value={formData.doctorId}
                    onChange={handleCreateChange}
                    className="form-control"
                    placeholder="D-2002"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Test Type *</label>
                <select
                  name="testType"
                  value={formData.testType}
                  onChange={handleCreateChange}
                  className="form-control"
                >
                  <option value="BLOOD_TEST">Blood Test</option>
                  <option value="URINE_TEST">Urine Test</option>
                  <option value="XRAY">X-Ray</option>
                  <option value="MRI">MRI</option>
                  <option value="CT_SCAN">CT Scan</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Test Name / Description *</label>
                <input
                  type="text"
                  name="testName"
                  required
                  value={formData.testName}
                  onChange={handleCreateChange}
                  placeholder="e.g. Complete Blood Count (CBC)"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleCreateChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                Create Request
              </button>
            </div>
          </form>
        </div>

        {/* Submit Results Form */}
        <div className="modal" style={{ position: 'relative', width: '100%', maxWidth: 'none', margin: 0, boxShadow: 'var(--shadow-blue)' }}>
          <div className="modal-header" style={{ background: 'var(--blue-lt)' }}>
            <h2 style={{ fontSize: '1.25rem' }}>🔬 Submit Results</h2>
          </div>
          
          {inProgressReports.length === 0 ? (
            <div className="modal-body" style={{ padding: '60px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>🧪</div>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem' }}>
                No reports are currently <strong>IN_PROGRESS</strong>.
              </p>
              <p className="text-muted text-xs mt-2">
                Start a test from the pending list to add results.
              </p>
            </div>
          ) : (
            <form onSubmit={submitTestResults}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Select Report *</label>
                  <select
                    required
                    value={activeReportId}
                    onChange={(e) => setActiveReportId(e.target.value)}
                    className="form-control"
                  >
                    <option value="" disabled>Select in-progress report</option>
                    {inProgressReports.map(report => (
                      <option key={report.reportId} value={report.reportId}>
                        {report.reportId} - {report.testName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Test Results *</label>
                  <textarea
                    name="results"
                    required
                    rows="5"
                    value={resultsData.results}
                    onChange={handleResultsChange}
                    className="form-control"
                    placeholder="Enter final readings and findings..."
                  />
                </div>

                <div className="form-group">
                  <label>Normal Range (Reference)</label>
                  <input
                    type="text"
                    name="normalRange"
                    value={resultsData.normalRange}
                    onChange={handleResultsChange}
                    className="form-control"
                    placeholder="e.g. 10.5 - 18.0 g/dL"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="submit"
                  disabled={loading || !activeReportId}
                  className="btn btn-primary"
                  style={{ background: 'var(--success)', width: '100%' }}
                >
                  Submit & Complete
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabReportForm;
