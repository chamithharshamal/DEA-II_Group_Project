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

      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        {/* Create New Test Request Form */}
        <div style={{ background: 'var(--off-white)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px 0', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
            + Create New Test Request
          </h3>
          <form onSubmit={submitNewReport} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Patient ID *</label>
              <input
                type="text"
                name="patientId"
                required
                value={formData.patientId}
                onChange={handleCreateChange}
                className="input-field"
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
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Test Type *</label>
              <select
                name="testType"
                value={formData.testType}
                onChange={handleCreateChange}
                className="input-field"
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
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                name="notes"
                rows="2"
                style={{ resize: 'vertical' }}
                value={formData.notes}
                onChange={handleCreateChange}
                className="input-field"
              />
            </div>

            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                Create Request
              </button>
            </div>
          </form>
        </div>

        {/* Submit Results Form */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--primary-blue-light)', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
            🔬 Submit Test Results
          </h3>
          
          {inProgressReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)', border: '2px dashed var(--border)', borderRadius: '8px' }}>
              No reports are currently <strong>IN_PROGRESS</strong>.<br/><br/>
              Go to Pending Tests and mark a test as "Start" first.
            </div>
          ) : (
            <form onSubmit={submitTestResults} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Select Report *</label>
                <select
                  required
                  value={activeReportId}
                  onChange={(e) => setActiveReportId(e.target.value)}
                  className="input-field"
                >
                  <option value="" disabled>Select an in-progress lab report</option>
                  {inProgressReports.map(report => (
                    <option key={report.reportId} value={report.reportId}>
                      {report.reportId} - {report.testName} ({report.patientId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Test Results *</label>
                <textarea
                  name="results"
                  required
                  rows="4"
                  style={{ resize: 'vertical' }}
                  value={resultsData.results}
                  onChange={handleResultsChange}
                  className="input-field"
                  placeholder="Enter final readings and qualitative findings..."
                />
              </div>

              <div className="form-group">
                <label>Normal Range (Reference)</label>
                <input
                  type="text"
                  name="normalRange"
                  value={resultsData.normalRange}
                  onChange={handleResultsChange}
                  className="input-field"
                  placeholder="e.g. 10.5 - 18.0 g/dL"
                />
              </div>

              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={loading || !activeReportId}
                  className="btn btn-primary"
                  style={{ background: 'var(--success)' }}
                >
                  Submit & Complete Report
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
