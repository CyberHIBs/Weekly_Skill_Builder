import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';


const Reports = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/progress/statistics/');
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Prepare CSV data
  const prepareCSVData = () => {
    if (!stats?.top_skills) return [];

    return stats.top_skills.map((item) => ({
      Skill: item.skill__skill_name,
      'Total Hours': parseFloat(item.total_hours || 0),
      'Practice Count': item.count,
      'Average Hours': (parseFloat(item.total_hours || 0) / item.count).toFixed(2),
    }));
  };

    // Export to PDF (Simple Version - No Tables)
  const exportToPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('Weekly Skill Tracker - Progress Report', 105, yPos, { align: 'center' });
    
    yPos += 15;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated for: ${user?.name || 'User'}`, 20, yPos);
    
    yPos += 7;
    doc.text(`Role: ${user?.role || 'N/A'}`, 20, yPos);
    
    yPos += 7;
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, yPos);
    
    yPos += 15;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);
    
    // Summary Statistics
    yPos += 10;
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text('Summary Statistics', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Entries: ${stats?.total_entries || 0}`, 20, yPos);
    
    yPos += 7;
    doc.text(`Total Hours: ${stats?.total_hours || 0}h`, 20, yPos);
    
    yPos += 7;
    doc.text(`Average Hours/Week: ${stats?.average_hours_per_week || 0}h`, 20, yPos);
    
    yPos += 7;
    doc.text(`Skills Practiced: ${stats?.top_skills?.length || 0}`, 20, yPos);
    
    // Top Skills
    if (stats?.top_skills && stats.top_skills.length > 0) {
      yPos += 15;
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('Top Skills by Hours', 20, yPos);
      
      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      stats.top_skills.slice(0, 15).forEach((skill, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        const hours = parseFloat(skill.total_hours || 0).toFixed(1);
        const avg = (parseFloat(skill.total_hours || 0) / skill.count).toFixed(1);
        doc.text(
          `${index + 1}. ${skill.skill__skill_name}: ${hours}h (${skill.count} entries, avg: ${avg}h)`,
          25,
          yPos
        );
        yPos += 7;
      });
    }
    
    // Proficiency Distribution
    if (stats?.proficiency_distribution && stats.proficiency_distribution.length > 0) {
      yPos += 10;
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(16, 185, 129);
      doc.text('Proficiency Distribution', 20, yPos);
      
      yPos += 10;
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      stats.proficiency_distribution.forEach((item) => {
        const level = item.proficiency_level.charAt(0).toUpperCase() + item.proficiency_level.slice(1);
        const percent = ((item.count / (stats?.total_entries || 1)) * 100).toFixed(1);
        doc.text(`${level}: ${item.count} entries (${percent}%)`, 25, yPos);
        yPos += 7;
      });
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    }
    
    // Save
    const fileName = `skill-tracker-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const proficiencyData = stats?.proficiency_distribution?.map((item) => ({
    name: item.proficiency_level.charAt(0).toUpperCase() + item.proficiency_level.slice(1),
    value: item.count,
  })) || [];

  const topSkillsData = stats?.top_skills?.slice(0, 8).map((item) => ({
    name: item.skill__skill_name,
    hours: parseFloat(item.total_hours || 0),
    entries: item.count,
  })) || [];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Visualize your learning progress</p>
        </div>

        {/* Export Buttons */}
        <div className="flex space-x-3">
          <CSVLink
            data={prepareCSVData()}
            filename={`skill-tracker-report-${new Date().toISOString().split('T')[0]}.csv`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </CSVLink>

          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium opacity-90">Total Entries</h3>
          <p className="text-3xl font-bold mt-2">{stats?.total_entries || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium opacity-90">Total Hours</h3>
          <p className="text-3xl font-bold mt-2">{stats?.total_hours || 0}h</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium opacity-90">Average Hours/Week</h3>
          <p className="text-3xl font-bold mt-2">{stats?.average_hours_per_week || 0}h</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium opacity-90">Skills Practiced</h3>
          <p className="text-3xl font-bold mt-2">{stats?.top_skills?.length || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Proficiency Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Proficiency Distribution
          </h2>
          {proficiencyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={proficiencyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {proficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-12">No data available</p>
          )}
        </div>

        {/* Top Skills by Hours */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Top Skills by Hours
          </h2>
          {topSkillsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topSkillsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hours" fill="#3b82f6" name="Hours Spent" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-12">No data available</p>
          )}
        </div>

        {/* Skills Practice Count */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Detailed Skills Statistics
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Skill
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Total Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Entries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Avg Hours/Entry
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {topSkillsData.map((skill, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {skill.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {skill.hours}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {skill.entries}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {(skill.hours / skill.entries).toFixed(1)}h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
