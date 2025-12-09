import React from 'react';
import { useAuth } from '../context/AuthContext';

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join('');

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="mt-4 text-gray-600">No user data available. Please sign in again.</p>
      </div>
    );
  }

  const { name, email, role, created_at, updated_at } = user;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white rounded-2xl shadow-xl p-6 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
            {initials(name || email)}
          </div>
          <div>
            <p className="text-sm text-white/80">Signed in as</p>
            <h1 className="text-2xl font-semibold leading-tight">{name || 'Unknown User'}</h1>
            <p className="text-sm text-white/90">{email}</p>
          </div>
          <span className="ml-auto inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm font-medium capitalize">
            {role || 'user'}
          </span>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Account</h2>
            <div className="mt-4 space-y-4 text-gray-800">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-base font-medium">{name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-base font-medium break-all">{email || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium capitalize">
                  {role || '—'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Activity</h2>
            <div className="mt-4 space-y-4 text-gray-800">
              <div>
                <p className="text-xs text-gray-500">Member since</p>
                <p className="text-base font-medium">{created_at ? new Date(created_at).toLocaleDateString() : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last updated</p>
                <p className="text-base font-medium">{updated_at ? new Date(updated_at).toLocaleDateString() : '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
