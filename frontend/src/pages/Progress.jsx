import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Progress = () => {
  const [progressEntries, setProgressEntries] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    skill: '',
    week_number: '',
    year: new Date().getFullYear(),
    proficiency_level: 'beginner',
    hours_spent: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [progressRes, skillsRes] = await Promise.all([
        api.get('/progress/'),
        api.get('/skills/'),
      ]);
      
      const results = progressRes.data.results || progressRes.data;
      setProgressEntries(Array.isArray(results) ? results : []);
      setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek) + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingEntry) {
        await api.put(`/progress/${editingEntry.id}/`, formData);
      } else {
        await api.post('/progress/', formData);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      skill: '',
      week_number: '',
      year: new Date().getFullYear(),
      proficiency_level: 'beginner',
      hours_spent: '',
      notes: '',
    });
    setEditingEntry(null);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      skill: entry.skill,
      week_number: entry.week_number,
      year: entry.year,
      proficiency_level: entry.proficiency_level,
      hours_spent: entry.hours_spent,
      notes: entry.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/progress/${id}/`);
        fetchData();
      } catch (err) {
        setError('Failed to delete');
      }
    }
  };

  const getBadgeColor = (level) => {
    const colors = {
      beginner: 'bg-yellow-100 text-yellow-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-green-100 text-green-800',
    };
    return colors[level] || colors.beginner;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weekly Progress</h1>
          <p className="mt-2 text-gray-600">Track your learning journey</p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            resetForm();
            setFormData(prev => ({ ...prev, week_number: getCurrentWeek() }));
          }}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
        >
          + Add Progress
        </button>
      </div>

      <ErrorMessage message={error} />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {progressEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No entries yet. Start tracking!</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skill</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Week/Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {progressEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {entry.skill_details?.skill_name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">{entry.skill_details?.category}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    Week {entry.week_number}/{entry.year}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(entry.proficiency_level)}`}>
                      {entry.proficiency_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.hours_spent}h</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {entry.notes || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-3">
                    <button onClick={() => handleEdit(entry)} className="text-primary-600 hover:text-primary-900">Edit</button>
                    <button onClick={() => handleDelete(entry.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{editingEntry ? 'Edit' : 'Add'} Progress</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Skill *</label>
                <select required value={formData.skill} onChange={(e) => setFormData({ ...formData, skill: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">Select skill</option>
                  {skills.map(s => <option key={s.id} value={s.id}>{s.skill_name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Week *</label>
                  <input type="number" required min="1" max="53" value={formData.week_number} onChange={(e) => setFormData({ ...formData, week_number: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year *</label>
                  <input type="number" required value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Level *</label>
                <select required value={formData.proficiency_level} onChange={(e) => setFormData({ ...formData, proficiency_level: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hours *</label>
                <input type="number" required min="0" step="0.5" value={formData.hours_spent} onChange={(e) => setFormData({ ...formData, hours_spent: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea rows="3" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">{editingEntry ? 'Update' : 'Add'}</button>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
