'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Users, Heart, Lightbulb, Clock, Check, Pill, Plus, Trash2, Edit2, Bell } from 'lucide-react';
import { format } from 'date-fns';
import ConfirmDialog from '@/components/ConfirmDialog';
import { medicineReminderService } from '@/lib/medicineReminder';

interface CaregiverInsight {
  id: string;
  author: string;
  relationship: string;
  insight: string;
  category: 'memory' | 'calm' | 'engagement' | 'safety' | 'routine';
  date: string;
}

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
  takenToday: boolean;
  lastTaken?: string;
}

const insightCategories = {
  memory: { label: 'Memory Triggers', icon: '🧠', color: 'from-purple-500 to-pink-500' },
  calm: { label: 'Calming Strategies', icon: '💆', color: 'from-blue-500 to-cyan-500' },
  engagement: { label: 'Engagement Ideas', icon: '🎯', color: 'from-green-500 to-teal-500' },
  safety: { label: 'Safety Tips', icon: '🛡️', color: 'from-red-500 to-orange-500' },
  routine: { label: 'Routine Helpers', icon: '📅', color: 'from-indigo-500 to-purple-500' },
};

export default function CaregiverInsightsPage() {
  const [activeTab, setActiveTab] = useState<'insights' | 'medicines'>('insights');
  const [insights, setInsights] = useState<CaregiverInsight[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [newInsight, setNewInsight] = useState('');
  const [author, setAuthor] = useState('');
  const [relationship, setRelationship] = useState('');
  const [category, setCategory] = useState<CaregiverInsight['category']>('memory');
  const [saving, setSaving] = useState(false);
  
  // Medicine form state
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    frequency: '',
    timeOfDay: [] as string[],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
  });
  
  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<string | null>(null);
  
  // Medicine reminders
  const [showReminderNotification, setShowReminderNotification] = useState(false);
  const [reminderMedicines, setReminderMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    loadInsights();
    loadMedicines();
    // Check which medicines need to be taken today
    checkDailyMedicineStatus();
  }, []);

  useEffect(() => {
    if (medicines.length === 0) return;
    
    // Check reminders whenever medicines change
    checkMedicineReminders();
    
    // Check reminders every minute
    const reminderInterval = setInterval(() => {
      checkMedicineReminders();
    }, 60000); // Check every minute

    return () => clearInterval(reminderInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicines]);

  const loadInsights = () => {
    const stored = localStorage.getItem('reminoracare-insights');
    if (stored) {
      setInsights(JSON.parse(stored));
    }
  };

  const loadMedicines = () => {
    const stored = localStorage.getItem('reminoracare-medicines');
    if (stored) {
      const parsed = JSON.parse(stored);
      setMedicines(parsed);
      return parsed;
    }
    return [];
  };

  const checkDailyMedicineStatus = () => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('reminoracare-medicines');
    if (!stored) return;
    
    const medicines: Medicine[] = JSON.parse(stored);
    const updated = medicines.map(med => {
      const lastTaken = med.lastTaken ? med.lastTaken.split('T')[0] : '';
      return { ...med, takenToday: lastTaken === today };
    });
    setMedicines(updated);
    localStorage.setItem('reminoracare-medicines', JSON.stringify(updated));
  };

  const handleSave = () => {
    if (!newInsight.trim() || !author.trim() || !relationship.trim()) return;

    setSaving(true);

    const insight: CaregiverInsight = {
      id: Date.now().toString(),
      author,
      relationship,
      insight: newInsight,
      category,
      date: new Date().toISOString(),
    };

    const updated = [insight, ...insights];
    localStorage.setItem('reminoracare-insights', JSON.stringify(updated));
    loadInsights();

    setNewInsight('');
    setAuthor('');
    setRelationship('');
    setCategory('memory');
    setSaving(false);
  };

  const removeInsight = (id: string) => {
    const updated = insights.filter(i => i.id !== id);
    localStorage.setItem('reminoracare-insights', JSON.stringify(updated));
    loadInsights();
  };

  const getCategoryInfo = (cat: string) => {
    return insightCategories[cat as keyof typeof insightCategories] || insightCategories.memory;
  };

  const handleSaveMedicine = () => {
    if (!newMedicine.name.trim() || !newMedicine.dosage.trim() || !newMedicine.frequency.trim() || newMedicine.timeOfDay.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const medicine: Medicine = {
      id: editingMedicine ? editingMedicine.id : Date.now().toString(),
      name: newMedicine.name,
      dosage: newMedicine.dosage,
      frequency: newMedicine.frequency,
      timeOfDay: newMedicine.timeOfDay,
      startDate: newMedicine.startDate,
      endDate: newMedicine.endDate || undefined,
      notes: newMedicine.notes || undefined,
      takenToday: false,
      lastTaken: undefined,
    };

    let updated;
    if (editingMedicine) {
      updated = medicines.map(m => m.id === medicine.id ? medicine : m);
    } else {
      updated = [medicine, ...medicines];
    }

    setMedicines(updated);
    localStorage.setItem('reminoracare-medicines', JSON.stringify(updated));
    setShowMedicineModal(false);
    setEditingMedicine(null);
    setNewMedicine({
      name: '',
      dosage: '',
      frequency: '',
      timeOfDay: [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: '',
    });
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicineToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteMedicine = () => {
    if (medicineToDelete) {
      const updated = medicines.filter(m => m.id !== medicineToDelete);
      setMedicines(updated);
      localStorage.setItem('reminoracare-medicines', JSON.stringify(updated));
      setMedicineToDelete(null);
    }
    setShowDeleteConfirm(false);
  };

  const handleEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setNewMedicine({
      name: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      timeOfDay: medicine.timeOfDay,
      startDate: medicine.startDate,
      endDate: medicine.endDate || '',
      notes: medicine.notes || '',
    });
    setShowMedicineModal(true);
  };

  const handleMarkTaken = (id: string) => {
    const updated = medicines.map(med => {
      if (med.id === id) {
        return {
          ...med,
          takenToday: true,
          lastTaken: new Date().toISOString(),
        };
      }
      return med;
    });
    setMedicines(updated);
    localStorage.setItem('reminoracare-medicines', JSON.stringify(updated));
  };

  const handleTimeOfDayToggle = (time: string) => {
    setNewMedicine(prev => ({
      ...prev,
      timeOfDay: prev.timeOfDay.includes(time)
        ? prev.timeOfDay.filter(t => t !== time)
        : [...prev.timeOfDay, time],
    }));
  };

  const checkMedicineReminders = () => {
    const dueMedicines = medicineReminderService.getDueMedicines(medicines);
    if (dueMedicines.length > 0) {
      setReminderMedicines(dueMedicines.map(r => r.medicine));
      setShowReminderNotification(true);
    } else {
      setShowReminderNotification(false);
      setReminderMedicines([]);
    }
  };

  const activeMedicines = medicines.filter(m => !m.endDate || new Date(m.endDate) >= new Date());
  const today = new Date().toISOString().split('T')[0];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 pb-32 fade-in">
        {/* Header */}
        <div className="mb-6 slide-up">
          <h2 className="text-3xl font-bold text-white mb-2">Caregiver Dashboard</h2>
          <p className="text-gray-400">Manage insights and medicine tracking for the patient</p>
        </div>

        {/* Medicine Reminder Notification */}
        {showReminderNotification && reminderMedicines.length > 0 && (
          <div className="mb-6 slide-up">
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">Medicine Reminder</h4>
                  <p className="text-sm text-gray-300">
                    {reminderMedicines.length === 1 
                      ? `Time to take ${reminderMedicines[0].name} (${reminderMedicines[0].dosage})`
                      : `${reminderMedicines.length} medicines need to be taken now`
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowReminderNotification(false);
                  setActiveTab('medicines');
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
              >
                View Medicines
              </button>
              <button
                onClick={() => setShowReminderNotification(false)}
                className="ml-2 p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Dismiss"
              >
                <span className="text-gray-400 hover:text-white text-xl">×</span>
              </button>
            </div>
          </div>
        )}

        {/* Tabs - Always Visible */}
        <div className="bg-gray-900/30 border border-gray-700/50 rounded-2xl p-2 mb-6 slide-up">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'insights'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/30'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300 border border-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Insights
              </div>
            </button>
            <button
              onClick={() => setActiveTab('medicines')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'medicines'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300 border border-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Pill className="w-5 h-5" />
                Medicine Tracker
                {activeMedicines.filter(m => !m.takenToday).length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {activeMedicines.filter(m => !m.takenToday).length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <>

        {/* Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-900/50 border border-teal-500/30 rounded-2xl p-5 slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{insights.length}</p>
                <p className="text-xs text-gray-400">Total Insights</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-purple-500/30 rounded-2xl p-5 slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">
                  {new Set(insights.map(i => i.author)).size}
                </p>
                <p className="text-xs text-gray-400">Contributors</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-blue-500/30 rounded-2xl p-5 slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">Last 7</p>
                <p className="text-xs text-gray-400">Days Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add New Insight */}
        <div className="bg-gray-900/50 border border-teal-500/30 rounded-3xl p-6 slide-up">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-400" />
            Share an Insight
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="John, Sarah, etc."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Relationship</label>
                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="Family, Caregiver, etc."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CaregiverInsight['category'])}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-teal-500"
              >
                {Object.entries(insightCategories).map(([key, info]) => (
                  <option key={key} value={key}>{info.icon} {info.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Insight</label>
              <textarea
                value={newInsight}
                onChange={(e) => setNewInsight(e.target.value)}
                placeholder="Share what helps them remember better, what calms them, activities they enjoy, safety tips, or helpful routines..."
                className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !newInsight.trim() || !author.trim() || !relationship.trim()}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Insight'}
            </button>
          </div>
        </div>

        {/* Insights List */}
        {insights.length > 0 && (
          <div className="slide-up">
            <h3 className="text-xl font-semibold text-white mb-4">All Insights</h3>
            <div className="space-y-4">
              {insights.map((insight) => {
                const catInfo = getCategoryInfo(insight.category);
                return (
                  <div
                    key={insight.id}
                    className="bg-gray-900/50 border border-gray-700 rounded-2xl p-5 hover:border-teal-500/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${catInfo.color} rounded-xl flex items-center justify-center`}>
                          <span className="text-2xl">{catInfo.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{insight.author}</p>
                          <p className="text-sm text-gray-400">{insight.relationship}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          {format(new Date(insight.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3">{insight.insight}</p>
                    <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs border border-teal-500/30">
                      {catInfo.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {insights.length === 0 && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-12 text-center slide-up">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No insights yet</h3>
            <p className="text-gray-400">Start sharing helpful strategies above</p>
          </div>
        )}
          </>
        )}

        {/* Medicines Tab */}
        {activeTab === 'medicines' && (
          <>
            {/* Add Medicine Button */}
            <div className="flex justify-end slide-up">
              <button
                onClick={() => {
                  setEditingMedicine(null);
                  setNewMedicine({
                    name: '',
                    dosage: '',
                    frequency: '',
                    timeOfDay: [],
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: '',
                    notes: '',
                  });
                  setShowMedicineModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add Medicine
              </button>
            </div>

            {/* Today's Medicines */}
            <div className="bg-gray-900/50 border border-purple-500/30 rounded-3xl p-6 slide-up">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-purple-400" />
                Today's Medicines ({format(new Date(), 'MMMM d, yyyy')})
              </h3>
              {activeMedicines.filter(m => !m.takenToday).length > 0 ? (
                <div className="space-y-3">
                  {activeMedicines
                    .filter(m => !m.takenToday)
                    .map(medicine => (
                      <div
                        key={medicine.id}
                        className="bg-gray-800/50 border border-red-500/30 rounded-xl p-4 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Pill className="w-5 h-5 text-purple-400" />
                            <h4 className="font-semibold text-white">{medicine.name}</h4>
                            <span className="text-sm text-gray-400">{medicine.dosage}</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            {medicine.frequency} • {medicine.timeOfDay.join(', ')}
                          </p>
                          {medicine.notes && (
                            <p className="text-xs text-gray-500 mt-1">{medicine.notes}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleMarkTaken(medicine.id)}
                          className="ml-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Mark Taken
                        </button>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">All medicines for today have been marked as taken!</p>
              )}
            </div>

            {/* All Medicines */}
            <div className="slide-up">
              <h3 className="text-xl font-semibold text-white mb-4">All Medicines</h3>
              {activeMedicines.length > 0 ? (
                <div className="space-y-3">
                  {activeMedicines.map(medicine => (
                    <div
                      key={medicine.id}
                      className="bg-gray-900/50 border border-gray-700 rounded-2xl p-5 hover:border-purple-500/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Pill className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">{medicine.name}</h4>
                            <p className="text-sm text-gray-400">
                              <strong>Dosage:</strong> {medicine.dosage} • <strong>Frequency:</strong> {medicine.frequency}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              <strong>Times:</strong> {medicine.timeOfDay.join(', ')}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Started: {format(new Date(medicine.startDate), 'MMM d, yyyy')}
                              {medicine.endDate && ` • Ends: ${format(new Date(medicine.endDate), 'MMM d, yyyy')}`}
                            </p>
                            {medicine.notes && (
                              <p className="text-sm text-gray-300 mt-2 italic">{medicine.notes}</p>
                            )}
                            {medicine.takenToday && (
                              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Taken today
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditMedicine(medicine)}
                            className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg border border-purple-500/30 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-purple-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteMedicine(medicine.id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-500/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-12 text-center">
                  <Pill className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No medicines added yet</h3>
                  <p className="text-gray-400 mb-4">Start tracking medicines for better care management</p>
                  <button
                    onClick={() => setShowMedicineModal(true)}
                    className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
                  >
                    Add Your First Medicine →
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Medicine Modal */}
        {showMedicineModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowMedicineModal(false)}>
            <div className="bg-gray-900 border border-purple-500/30 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-white mb-4">
                {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Medicine Name *</label>
                  <input
                    type="text"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    placeholder="e.g., Aspirin, Vitamin D"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Dosage *</label>
                  <input
                    type="text"
                    value={newMedicine.dosage}
                    onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    placeholder="e.g., 100mg, 1 tablet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Frequency *</label>
                  <select
                    value={newMedicine.frequency}
                    onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select frequency</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Four times daily">Four times daily</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time of Day *</label>
                  <div className="flex flex-wrap gap-2">
                    {['Morning', 'Afternoon', 'Evening', 'Night'].map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeOfDayToggle(time)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
                          newMedicine.timeOfDay.includes(time)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newMedicine.startDate}
                      onChange={(e) => setNewMedicine({ ...newMedicine, startDate: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Date (optional)</label>
                    <input
                      type="date"
                      value={newMedicine.endDate}
                      onChange={(e) => setNewMedicine({ ...newMedicine, endDate: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Notes (optional)</label>
                  <textarea
                    value={newMedicine.notes}
                    onChange={(e) => setNewMedicine({ ...newMedicine, notes: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                    rows={3}
                    placeholder="Additional notes or instructions..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowMedicineModal(false);
                    setEditingMedicine(null);
                    setNewMedicine({
                      name: '',
                      dosage: '',
                      frequency: '',
                      timeOfDay: [],
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: '',
                      notes: '',
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMedicine}
                  disabled={!newMedicine.name.trim() || !newMedicine.dosage.trim() || !newMedicine.frequency.trim() || newMedicine.timeOfDay.length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingMedicine ? 'Update' : 'Add'} Medicine
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Delete Medicine"
          message="Are you sure you want to delete this medicine? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDeleteMedicine}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setMedicineToDelete(null);
          }}
          variant="danger"
        />
      </div>
    </Layout>
  );
}
