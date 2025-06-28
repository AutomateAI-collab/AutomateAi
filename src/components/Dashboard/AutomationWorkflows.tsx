import React, { useState, useEffect } from 'react';
import { Play, Pause, Settings, Activity, Zap, X } from 'lucide-react';
import axios from 'axios';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'paused' | 'stopped';
  lastRun: string;
  nextRun: string;
  successRate: number;
  executionTime: string;
}

const AutomationWorkflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'System Health Monitor',
      description: 'Continuously monitors system performance and generates alerts',
      status: 'running',
      lastRun: '2 minutes ago',
      nextRun: 'In 3 minutes',
      successRate: 99.2,
      executionTime: '1.2s'
    },
    {
      id: '2',
      name: 'Automated Backup',
      description: 'Daily backup of critical data and configurations',
      status: 'running',
      lastRun: '6 hours ago',
      nextRun: 'In 18 hours',
      successRate: 100,
      executionTime: '45.3s'
    },
    {
      id: '3',
      name: 'Security Scan',
      description: 'Vulnerability assessment and threat detection',
      status: 'paused',
      lastRun: '1 day ago',
      nextRun: 'Manual trigger',
      successRate: 95.8,
      executionTime: '2.1s'
    },
    {
      id: '4',
      name: 'Log Analysis',
      description: 'AI-powered log analysis and anomaly detection',
      status: 'running',
      lastRun: '30 seconds ago',
      nextRun: 'In 30 seconds',
      successRate: 97.5,
      executionTime: '0.8s'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDesc, setNewWorkflowDesc] = useState('');
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [errorCreate, setErrorCreate] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_GROQ_API_URL}/workflows`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
          }
        });
        if (Array.isArray(response.data)) {
          setWorkflows(response.data);
        } else {
          console.warn('Workflows data is not an array:', response.data);
        }
      } catch (err) {
        console.error('Failed to fetch workflows:', err);
      }
    };
    fetchWorkflows();
  }, []);

  const toggleWorkflow = async (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    const newStatus = workflow.status === 'running' ? 'paused' : 'running';

    try {
      await axios.patch(
        `${import.meta.env.VITE_GROQ_API_URL}/workflows/${workflowId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
          }
        }
      );

      setWorkflows(prev =>
        prev.map(w =>
          w.id === workflowId
            ? { ...w, status: newStatus, lastRun: newStatus === 'running' ? 'Just now' : w.lastRun }
            : w
        )
      );
    } catch (err) {
      console.error(`Failed to update workflow status for ${workflowId}:`, err);
    }
  };

  const handleCreateWorkflow = async () => {
    if (!newWorkflowName.trim() || !newWorkflowDesc.trim()) {
      setErrorCreate('Please fill in all fields.');
      return;
    }

    setLoadingCreate(true);
    setErrorCreate(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_GROQ_API_URL}/workflows`,
        {
          name: newWorkflowName,
          description: newWorkflowDesc,
          status: 'paused',
          lastRun: 'Never',
          nextRun: 'Manual trigger',
          successRate: 0,
          executionTime: '0s'
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
          }
        }
      );

      setWorkflows((prev) => [...prev, response.data]);
      setIsModalOpen(false);
      setNewWorkflowName('');
      setNewWorkflowDesc('');
    } catch (err) {
      console.error('Failed to create workflow:', err);
      setErrorCreate('Failed to create workflow. Try again.');
    } finally {
      setLoadingCreate(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      running: 'bg-green-100 text-green-800 border-green-200',
      paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      stopped: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${classes[status as keyof typeof classes]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="w-4 h-4 text-green-500 animate-pulse" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'stopped':
        return <Play className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Automation Workflows</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
            style={{ backgroundColor: '#e8af08' }}
          >
            <Zap className="w-4 h-4" />
            <span>Create Workflow</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="relative bg-white rounded-lg p-6 border overflow-hidden group transition-all duration-300"
              style={{
                borderColor: '#2958c2',
                borderWidth: '2px'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-sm" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(workflow.status)}
                    <div>
                      <h4 className="font-semibold text-gray-800">{workflow.name}</h4>
                      <p className="text-sm text-gray-600">{workflow.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(workflow.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">Last Run</p>
                    <p className="font-medium text-gray-800">{workflow.lastRun}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Next Run</p>
                    <p className="font-medium text-gray-800">{workflow.nextRun}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Success Rate</p>
                    <p className="font-medium text-green-600">{workflow.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Avg. Time</p>
                    <p className="font-medium text-gray-800">{workflow.executionTime}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleWorkflow(workflow.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      workflow.status === 'running'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {workflow.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{workflow.status === 'running' ? 'Pause' : 'Start'}</span>
                  </button>

                  <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium">
                    <Settings className="w-4 h-4" />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for creating workflow */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Create New Workflow</h2>

            <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={newWorkflowName}
              onChange={(e) => setNewWorkflowName(e.target.value)}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newWorkflowDesc}
              onChange={(e) => setNewWorkflowDesc(e.target.value)}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              rows={3}
            />

            {errorCreate && (
              <p className="text-red-600 mb-4">{errorCreate}</p>
            )}

            <button
              onClick={handleCreateWorkflow}
              disabled={loadingCreate}
              className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 disabled:opacity-50"
            >
              {loadingCreate ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {/* Workflow Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-2">98.1%</div>
            <div className="text-sm text-gray-600">Overall Success Rate</div>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600 mb-2">1.4s</div>
            <div className="text-sm text-gray-600">Avg Execution Time</div>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600 mb-2">72</div>
            <div className="text-sm text-gray-600">Workflows Run This Month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationWorkflows;
