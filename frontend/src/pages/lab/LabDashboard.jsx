import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { labReportService } from '../../services/labReportService';
import { FiLogOut, FiActivity, FiUser, FiCheckCircle } from 'react-icons/fi';
import LabReportList from './LabReportList';
import LabReportForm from './LabReportForm';

const LabDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'completed', 'new'
  const user = labReportService.getCurrentUser();

  const handleLogout = () => {
    labReportService.logout();
    navigate('/lab/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FiActivity className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Lab Services Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <FiUser className="h-5 w-5 mr-2" />
                <span className="font-medium">{user?.name || 'Lab Technician'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="mb-6 flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Tests
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed Tests
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'new'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Create New Request
          </button>
        </div>

        {/* Dynamic Content based on Active Tab */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'pending' && <LabReportList statusFilter="PENDING" />}
          {activeTab === 'completed' && <LabReportList statusFilter="COMPLETED" />}
          {activeTab === 'new' && <LabReportForm onSuccess={() => setActiveTab('pending')} />}
        </div>
      </main>
    </div>
  );
};

export default LabDashboard;
