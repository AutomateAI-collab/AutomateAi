import React from 'react';
import { 
  Home, 
  Workflow, 
  Brain, 
  AlertTriangle, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, onLogout }) => {
  const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'workflows', label: 'Automation Workflows', icon: Workflow },
  {
    id: 'insights',
    label: (
      <div className="flex items-center gap-2">
        <span>AI Insights</span>
        <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full font-semibold">
          Beta
        </span>
      </div>
    ),
    icon: Brain,
  },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];


  return (
    <div className="bg-white shadow-lg h-full w-64 fixed left-0 top-0 z-10">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 ">
           <img src="/favicon.png" alt="" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">AI to Automate</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                activeSection === item.id
                  ? 'bg-yellow-50 text-yellow-700 border-r-4 border-yellow-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;