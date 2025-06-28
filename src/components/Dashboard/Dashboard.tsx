import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import SystemStatus from './SystemStatus';
import AutomationWorkflows from './AutomationWorkflows';
import AIInsights from './AIInsights';
import UserManagement from './UserManagement';

// Import AOS for animations
import AOS from 'aos';


const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setShowLogoutModal(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div data-aos="fade-up">
              <SystemStatus />
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <AutomationWorkflows />
            </div>
          </div>
        );
      case 'workflows':
        return (
          <div data-aos="fade-up">
            <AutomationWorkflows />
          </div>
        );
      case 'insights':
        return (
          <div data-aos="fade-up">
            <AIInsights />
          </div>
        );
      case 'alerts':
        return (
          <div data-aos="fade-up">
            <SystemStatus />
          </div>
        );
      case 'users':
        return (
          <div data-aos="fade-up">
            <UserManagement />
          </div>
        );
      case 'settings':
        return (
          <div data-aos="fade-up" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Settings</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">API Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <input
                      type="password"
                      placeholder="gsk_..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Rate Limit</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                      <option>10,000 requests/month</option>
                      <option>50,000 requests/month</option>
                      <option>100,000 requests/month</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Notification Preferences</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">SMS alerts</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" />
                    <span className="ml-2 text-sm text-gray-700">Push notifications</span>
                  </label>
                </div>
              </div>

              <div>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                        style={{ backgroundColor: '#e8af08' }}>
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />
      
      <div className="ml-64">
        <Navbar onLogout={handleLogout} />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" data-aos="zoom-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out of your AI Dashboard?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;