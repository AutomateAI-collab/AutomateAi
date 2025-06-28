import React, { useState } from 'react';
import { Search, Edit, Trash2, UserPlus, Shield, Key } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Suspended';
  lastActive: string;
  joinDate: string;
}

const AddUserButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
    style={{ backgroundColor: '#e8af08' }}
  >
    <UserPlus className="w-4 h-4" />
    <span>Add User</span>
  </button>
);

const SearchInput = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    <input
      type="text"
      placeholder="Search users..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
    />
  </div>
);

const ActionButton = ({
  icon,
  onClick,
  color,
  hoverColor,
  bgHover,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
  hoverColor: string;
  bgHover: string;
}) => (
  <button
    onClick={onClick}
    className={`p-1 rounded-lg transition-colors duration-200 ${color} ${hoverColor} ${bgHover}`}
  >
    {icon}
  </button>
);

const PaginationControls = ({
  currentPage,
  totalPages,
  setCurrentPage,
  indexOfFirstUser,
  indexOfLastUser,
  totalResults,
}: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  indexOfFirstUser: number;
  indexOfLastUser: number;
  totalResults: number;
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
          <span className="font-medium">{Math.min(indexOfLastUser, totalResults)}</span> of{' '}
          <span className="font-medium">{totalResults}</span> results
        </p>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                currentPage === page
                  ? 'z-10 bg-yellow-50 border-yellow-500 text-yellow-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '2 minutes ago',
      joinDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      role: 'User',
      status: 'Active',
      lastActive: '1 hour ago',
      joinDate: '2024-02-20',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'Viewer',
      status: 'Inactive',
      lastActive: '3 days ago',
      joinDate: '2024-03-10',
    },
    {
      id: '4',
      name: 'Emily Chen',
      email: 'emily.chen@company.com',
      role: 'User',
      status: 'Active',
      lastActive: '30 minutes ago',
      joinDate: '2024-01-08',
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@company.com',
      role: 'Admin',
      status: 'Suspended',
      lastActive: '1 week ago',
      joinDate: '2023-12-05',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<'edit' | 'delete' | 'reset' | 'add' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const filteredUsers = users.filter((user) =>
    [user.name, user.email, user.role].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Active: 'bg-green-100 text-green-800 border-green-200',
      Inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      Suspended: 'bg-red-100 text-red-800 border-red-200',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleClasses = {
      Admin: 'bg-purple-100 text-purple-800 border-purple-200',
      User: 'bg-blue-100 text-blue-800 border-blue-200',
      Viewer: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${roleClasses[role as keyof typeof roleClasses]}`}>
        {role}
      </span>
    );
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowModal('edit');
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setShowModal('delete');
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setShowModal('reset');
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setShowModal(null);
      setSelectedUser(null);
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map((user) =>
      user.id === userId
        ? {
            ...user,
            status: user.status === 'Active' ? 'Inactive' : 'Active',
          }
        : user
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
          <AddUserButton onClick={() => setShowModal('add')} />
        </div>
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {user.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActive}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-2">
                    <ActionButton icon={<Edit className="w-4 h-4" />} onClick={() => handleEdit(user)} color="text-blue-600" hoverColor="hover:text-blue-900" bgHover="hover:bg-blue-50" />
                    <ActionButton icon={<Key className="w-4 h-4" />} onClick={() => handleResetPassword(user)} color="text-yellow-600" hoverColor="hover:text-yellow-900" bgHover="hover:bg-yellow-50" />
                    <ActionButton icon={<Shield className="w-4 h-4" />} onClick={() => toggleUserStatus(user.id)} color={user.status === 'Active' ? 'text-red-600' : 'text-green-600'} hoverColor={user.status === 'Active' ? 'hover:text-red-900' : 'hover:text-green-900'} bgHover={user.status === 'Active' ? 'hover:bg-red-50' : 'hover:bg-green-50'} />
                    <ActionButton icon={<Trash2 className="w-4 h-4" />} onClick={() => handleDelete(user)} color="text-red-600" hoverColor="hover:text-red-900" bgHover="hover:bg-red-50" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          indexOfFirstUser={indexOfFirstUser}
          indexOfLastUser={indexOfLastUser}
          totalResults={filteredUsers.length}
        />
      </div>

      {/* Add Modal (Optional Form Logic) */}
      {showModal === 'add' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New User</h3>
            {/* Add form logic here */}
            <div className="flex space-x-3 mt-6">
              <button className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-200">Save</button>
              <button onClick={() => setShowModal(null)} className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showModal === 'delete' && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200">Delete</button>
              <button onClick={() => setShowModal(null)} className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Modal */}
      {showModal === 'reset' && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reset Password</h3>
            <p className="text-gray-600 mb-6">
              Send a password reset email to <strong>{selectedUser.email}</strong>?
            </p>
            <div className="flex space-x-3">
              <button onClick={() => setShowModal(null)} className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-200" style={{ backgroundColor: '#e8af08' }}>Send Reset Email</button>
              <button onClick={() => setShowModal(null)} className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
