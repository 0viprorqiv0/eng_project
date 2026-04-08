import React from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Unauthorized() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
        <p className="text-slate-600 mb-6">You don't have permission to access the requested page.</p>
        <div className="bg-slate-100 p-4 rounded-xl mb-6 text-sm text-left">
          <p><strong>Current Role:</strong> {user?.role || 'Guest'}</p>
        </div>
        <div className="space-y-3">
          <button onClick={() => navigate('/')} className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700">Home</button>
          <div className="pt-4 border-t border-slate-100 mt-4 flex justify-center gap-2">
            <button onClick={() => { login({ id: 1, name: 'Admin', email: 'a@a.com', role: 'admin'}, 'fake'); navigate('/admin'); }} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded">Switch Admin</button>
            <button onClick={() => { login({ id: 2, name: 'Teacher', email: 't@a.com', role: 'teacher'}, 'fake'); navigate('/teacher'); }} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded">Switch Teacher</button>
            <button onClick={() => { login({ id: 3, name: 'Student', email: 's@a.com', role: 'student'}, 'fake'); navigate('/student'); }} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded">Switch Student</button>
            <button onClick={() => { logout(); navigate('/login'); }} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
