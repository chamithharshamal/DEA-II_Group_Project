import React, { useState, useEffect } from 'react';
import { labReportService } from '../../services/labReportService';
import { FiSave, FiAlertCircle } from 'react-icons/fi';

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
    <div className="p-6">
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center">
          <FiAlertCircle className="text-red-500 mr-2" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {successMsg && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
          <p className="text-sm text-green-700">{successMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create New Test Request Form */}
        <div className="bg-white border text-gray-800 shadow-sm sm:rounded-lg">
           <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 bg-purple-50 p-2 rounded text-purple-800 border-l-4 border-purple-500">
              Create New Test Request
            </h3>
            <form onSubmit={submitNewReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                <input
                  type="text"
                  name="patientId"
                  required
                  value={formData.patientId}
                  onChange={handleCreateChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
                <input
                  type="text"
                  name="doctorId"
                  required
                  value={formData.doctorId}
                  onChange={handleCreateChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Test Type</label>
                <select
                  name="testType"
                  value={formData.testType}
                  onChange={handleCreateChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 bg-white"
                >
                  <option value="BLOOD_TEST">Blood Test</option>
                  <option value="URINE_TEST">Urine Test</option>
                  <option value="XRAY">X-Ray</option>
                  <option value="MRI">MRI</option>
                  <option value="CT_SCAN">CT Scan</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Test Name / Description</label>
                <input
                  type="text"
                  name="testName"
                  required
                  value={formData.testName}
                  onChange={handleCreateChange}
                  placeholder="e.g. Complete Blood Count (CBC)"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                <textarea
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleCreateChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>

              <div className="pt-2 flex flex-row-reverse">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Submit Results Form */}
        <div className="bg-white border shadow-sm sm:rounded-lg">
           <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 bg-green-50 p-2 rounded text-green-800 border-l-4 border-green-500">
              Submit Test Results
            </h3>
            
            {inProgressReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-md">
                No reports are currently <span className="font-semibold text-blue-600">IN_PROGRESS</span>.<br/>
                Go to Pending Tests and mark a test as "Start" first.
              </div>
            ) : (
              <form onSubmit={submitTestResults} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Report</label>
                  <select
                    required
                    value={activeReportId}
                    onChange={(e) => setActiveReportId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 bg-white"
                  >
                    <option value="" disabled>Select an in-progress lab report</option>
                    {inProgressReports.map(report => (
                      <option key={report.reportId} value={report.reportId}>
                        {report.reportId} - {report.testName} ({report.patientId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Test Results</label>
                  <textarea
                    name="results"
                    required
                    rows="4"
                    value={resultsData.results}
                    onChange={handleResultsChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    placeholder="Enter final readings and qualitative findings..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Normal Range (Reference)</label>
                  <input
                    type="text"
                    name="normalRange"
                    value={resultsData.normalRange}
                    onChange={handleResultsChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    placeholder="e.g. 10.5 - 18.0 g/dL"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || !activeReportId}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <FiSave className="mr-2" />
                    Submit & Complete Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReportForm;
