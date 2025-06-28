import React, { useState, useEffect } from 'react';
import { RefreshCw, Server, Database, Wifi, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface SystemStatusProps {
  onRefresh?: () => void;
}

interface SystemHealth {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  lastChecked: string;
}

interface Alert {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  resolved: boolean;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [systems, setSystems] = useState<SystemHealth[]>([
    { id: '1', name: 'Web Servers', status: 'healthy', uptime: '99.9%', lastChecked: '2 min ago' },
    { id: '2', name: 'Database Cluster', status: 'healthy', uptime: '99.8%', lastChecked: '1 min ago' },
    { id: '3', name: 'API Gateway', status: 'warning', uptime: '98.5%', lastChecked: '3 min ago' },
    { id: '4', name: 'Authentication Service', status: 'healthy', uptime: '99.9%', lastChecked: '1 min ago' },
    { id: '5', name: 'File Storage', status: 'critical', uptime: '95.2%', lastChecked: '5 min ago' },
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      message: 'High CPU usage detected on server cluster-03',
      severity: 'high',
      timestamp: '2 minutes ago',
      resolved: false
    },
    {
      id: '2',
      message: 'Disk space warning: Storage volume at 85% capacity',
      severity: 'medium',
      timestamp: '15 minutes ago',
      resolved: false
    },
    {
      id: '3',
      message: 'API response time increased by 200ms',
      severity: 'low',
      timestamp: '1 hour ago',
      resolved: true
    }
  ]);

  const handleRefresh = async () => {
    setLoading(true);
    onRefresh?.();
    
    // Simulate API call to Groq
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate refreshed data
    setSystems(prev => prev.map(system => ({
      ...system,
      lastChecked: 'Just now'
    })));
    
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Server className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      healthy: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${classes[status as keyof typeof classes]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const classes = {
      low: 'bg-blue-100 text-blue-800 border-blue-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${classes[severity as keyof typeof classes]}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">System Health</h3>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            style={{ backgroundColor: '#234bc4' }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systems.map((system) => (
            <div key={system.id} className="bg-gray-50 rounded-lg p-4 border"
style={{ borderColor: '#2958c2', 
  borderWidth: '2px'
}}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(system.status)}
                  <span className="font-medium text-gray-800">{system.name}</span>
                </div>
                {getStatusBadge(system.status)}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Uptime: {system.uptime}</p>
                <p>Last checked: {system.lastChecked}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Generated Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">AI-Generated Alerts</h3>
          <span className="text-sm text-gray-500">Powered by AI</span>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${
                alert.resolved ? 'bg-gray-50 border-gray-400' : 
                alert.severity === 'high' ? 'bg-red-50 border-red-400' :
                alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`font-medium ${alert.resolved ? 'text-gray-600' : 'text-gray-800'}`}>
                    {alert.message}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{alert.timestamp}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getSeverityBadge(alert.severity)}
                  {alert.resolved && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;