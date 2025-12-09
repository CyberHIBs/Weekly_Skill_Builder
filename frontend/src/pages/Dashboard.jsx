import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {user?.role === 'admin' ? 'System Overview' : 'Your Learning Progress'}
        </p>
      </div>

      {/* Stats Cards - Now Interactive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Progress Card */}
        <div
          onClick={() => navigate('/progress')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-blue-600 hover:to-blue-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Total Progress Entries</p>
              <p className="text-3xl font-bold mt-2">
                {dashboardData?.total_progress_entries || 0}
              </p>
            </div>
            <div className="text-4xl opacity-80">📊</div>
          </div>
          <p className="text-xs mt-3 opacity-75">Click to view all entries →</p>
        </div>

        {/* Total Hours Card */}
        <div
          onClick={() => navigate('/progress')}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-green-600 hover:to-green-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Total Hours Logged</p>
              <p className="text-3xl font-bold mt-2">
                {dashboardData?.total_hours || 0}h
              </p>
            </div>
            <div className="text-4xl opacity-80">⏱️</div>
          </div>
          <p className="text-xs mt-3 opacity-75">Click to track progress →</p>
        </div>

        {/* Skills Card */}
        <div
          onClick={() => navigate('/skills')}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-purple-600 hover:to-purple-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">
                {user?.role === 'admin' ? 'Total Skills' : 'Skills Practiced'}
              </p>
              <p className="text-3xl font-bold mt-2">
                {dashboardData?.total_skills || 0}
              </p>
            </div>
            <div className="text-4xl opacity-80">🎯</div>
          </div>
          <p className="text-xs mt-3 opacity-75">Click to browse skills →</p>
        </div>

        {/* Reports Card */}
        <div
          onClick={() => navigate('/reports')}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-orange-600 hover:to-orange-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">
                {user?.role === 'admin' ? 'Total Students' : 'View Reports'}
              </p>
              <p className="text-3xl font-bold mt-2">
                {user?.role === 'admin' ? dashboardData?.total_students || 0 : '📈'}
              </p>
            </div>
            <div className="text-4xl opacity-80">📑</div>
          </div>
          <p className="text-xs mt-3 opacity-75">Click to view analytics →</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {dashboardData?.recent_progress?.length > 0 ? (
            dashboardData.recent_progress.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => navigate('/progress')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-300 font-bold">
                      {entry.skill_details?.skill_name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {entry.skill_details?.skill_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Week {entry.week_number}, {entry.year} - {entry.hours_spent}h
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {entry.proficiency_level}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No recent activity. Start tracking your progress!
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/progress')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left border-2 border-transparent hover:border-primary-500"
        >
          <div className="text-3xl mb-3">✍️</div>
          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
            Log Progress
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Record your weekly skill development
          </p>
        </button>

        <button
          onClick={() => navigate('/skills')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left border-2 border-transparent hover:border-primary-500"
        >
          <div className="text-3xl mb-3">📚</div>
          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
            Browse Skills
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Explore available skills to learn
          </p>
        </button>

        <button
          onClick={() => navigate('/reports')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left border-2 border-transparent hover:border-primary-500"
        >
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
            View Reports
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Analyze your learning progress
          </p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
