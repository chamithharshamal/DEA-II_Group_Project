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
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600 bg-red-50 rounded-md">{error}</div>;
  }

  return (
    <div className="p-6">
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search by Patient ID or Report ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

      {/* Reports Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Info</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  <FiFileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p>No lab reports found matching your criteria.</p>
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr key={report.reportId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.reportId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.patientId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{report.testName}</div>
                    <div className="text-sm text-gray-500 text-xs">{report.testType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.reportDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    {report.status === 'PENDING' && (
                      <button
                        onClick={() => handleUpdateStatus(report.reportId, 'IN_PROGRESS')}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        title="Mark In Progress"
                      >
                         <FiCheck className="mr-1"/> Start
                      </button>
                    )}
                    {report.status === 'COMPLETED' && (
                      <button
                        onClick={() => {
                          alert(`Results: ${report.results}\nNormal Range: ${report.normalRange}`);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Results
                      </button>
                    )}
                    {(report.status === 'PENDING' || report.status === 'IN_PROGRESS') && (
                       <button
                       onClick={() => handleUpdateStatus(report.reportId, 'CANCELLED')}
                       className="text-red-600 hover:text-red-900 inline-flex items-center"
                       title="Cancel Test"
                     >
                        <FiX className="mr-1"/> Cancel
                     </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabReportList;
