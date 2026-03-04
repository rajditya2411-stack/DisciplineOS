import { useState, useMemo } from 'react';
import { Plus, Target, X, Calendar, ChevronLeft, ChevronRight, Trash2, Edit3 } from 'lucide-react';
import { useGoals } from '../../context/GoalsContext';
import { useHabits } from '../../context/HabitsContext';

function GoalDetailsModal({ goal, onClose }) {
  const { updateGoal } = useGoals();
  const [logVal, setLogVal] = useState('');
  
  const progress = Math.min(100, (Number(goal.current) / Number(goal.target)) * 100);
  
  const handleLogProgress = (e) => {
    e.preventDefault();
    if (!logVal) return;
    updateGoal(goal.id, { current: Number(goal.current) + Number(logVal) });
    setLogVal('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 space-y-8 overflow-y-auto">
           <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-[#111827]">{goal.name}</h2>
                <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">{goal.category}</p>
              </div>
              <span className="px-4 py-1 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                {goal.status || 'Active'}
              </span>
           </div>

           <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                 <span className="block text-2xl font-bold text-[#111827]">{goal.current}</span>
                 <span className="text-[10px] font-bold text-text-secondary uppercase">Current</span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                 <span className="block text-2xl font-bold text-[#111827]">{goal.target}</span>
                 <span className="text-[10px] font-bold text-text-secondary uppercase">Target</span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                 <span className="block text-2xl font-bold text-[#111827]">{goal.unit}</span>
                 <span className="text-[10px] font-bold text-text-secondary uppercase">Unit</span>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-end">
                 <h4 className="text-sm font-bold text-[#111827]">Progress to Goal</h4>
                 <span className="text-xs font-bold text-text-secondary">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                 <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
           </div>

           <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#111827]">Update Progress</h4>
              <form onSubmit={handleLogProgress} className="flex gap-2">
                 <input 
                   type="number" 
                   placeholder={`Add to ${goal.unit}...`} 
                   value={logVal} 
                   onChange={e => setLogVal(e.target.value)}
                   className="flex-1 px-4 py-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 text-sm font-medium" 
                 />
                 <button type="submit" className="px-6 bg-black text-white rounded-xl font-bold hover:opacity-90">
                    Add
                 </button>
              </form>
           </div>

           {goal.description && (
             <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#111827]">Description</h4>
                <p className="text-sm text-text-secondary leading-relaxed bg-gray-50 p-4 rounded-xl">{goal.description}</p>
             </div>
           )}
        </div>
        <div className="p-4 bg-gray-50 border-t border-border flex justify-end gap-3">
           <button onClick={onClose} className="px-6 py-2 border border-border bg-white text-text-secondary rounded-xl font-bold">Close Card</button>
           <button onClick={onClose} className="px-6 py-2 bg-black text-white rounded-xl font-bold">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default function GoalsTemplates() {
  const { goals, addGoal, deleteGoal, updateGoal } = useGoals();
  const { habits } = useHabits();
  const [activeTab, setActiveTab] = useState('Active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgressId, setEditingProgressId] = useState(null);
  const [tempProgress, setTempProgress] = useState('');

  const [selectedGoal, setSelectedGoal] = useState(null);

  const [newGoal, setNewGoal] = useState({
    name: '',
    category: 'Personal',
    type: 'Count',
    target: 30,
    unit: 'days',
    current: 0,
    habitId: 'None',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    description: '',
    isTemplate: false
  });

  const filteredGoals = useMemo(() => {
    if (activeTab === 'Templates') return goals.filter(g => g.isTemplate);
    if (activeTab === 'Completed') return goals.filter(g => g.status === 'Completed');
    return goals.filter(g => !g.isTemplate && g.status === 'Active');
  }, [goals, activeTab]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    addGoal(newGoal);
    setIsModalOpen(false);
    setNewGoal({
      name: '', category: 'Personal', type: 'Count', target: 30, unit: 'days',
      current: 0, habitId: 'None', startDate: new Date().toISOString().split('T')[0],
      endDate: '', description: '', isTemplate: false
    });
  };

  const handleUpdateProgress = (id, current) => {
    updateGoal(id, { current: Number(current) });
    setEditingProgressId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
           <h1 className="text-xl font-bold text-[#111827] flex items-center gap-2">
             <span className="text-text-secondary">»</span> GoalsTemplates
           </h1>
           <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-4 h-4 text-text-secondary" /></button>
              <span className="text-sm font-medium text-text-primary whitespace-nowrap">Saturday, Feb 28, 2026</span>
              <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-4 h-4 text-text-secondary" /></button>
              <button className="px-3 py-1 bg-[#111827] text-white text-xs font-bold rounded-lg">Today</button>
           </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Goals & Templates</h2>
          <p className="text-sm text-text-secondary mt-1">{filteredGoals.length} {activeTab.toLowerCase()} goals</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111827] text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:overflow-visible">
        {['Active', 'Templates', 'Completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-xl text-sm font-bold transition-all border whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-[#111827] text-white border-[#111827]' 
                : 'bg-white text-text-secondary border-border hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-border min-h-[400px] flex flex-col items-center justify-center text-center">
        {filteredGoals.length === 0 ? (
          <div className="space-y-4 p-12">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-border">
              <Target className="w-8 h-8 text-[#111827]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111827]">No {activeTab.toLowerCase()} goals yet</h3>
              <p className="text-sm text-text-secondary mt-1">Create your first goal to get started</p>
            </div>
          </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full p-4 sm:p-6">
              {filteredGoals.map(goal => {
                const progress = Math.min(100, (Number(goal.current) / Number(goal.target)) * 100);
                const isEditing = editingProgressId === goal.id;
                
                return (
                  <div key={goal.id} className="bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-sm flex flex-col gap-4 text-left group transition-all hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-[#111827] truncate">{goal.name}</h3>
                        <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">{goal.category}</p>
                      </div>
                      <div className="flex gap-2 shrink-0 ml-2">
                        <span className="px-2.5 py-1 bg-gray-100 text-[#111827] rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                          {goal.type}
                        </span>
                        <button 
                          onClick={() => deleteGoal(goal.id)}
                          className="p-1 text-text-secondary hover:text-danger opacity-0 group-hover:opacity-100 lg:group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-wider items-center">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              value={tempProgress}
                              onChange={(e) => setTempProgress(e.target.value)}
                              autoFocus
                              className="w-16 px-2 py-1 border border-primary/50 rounded-lg text-xs text-[#111827] focus:outline-none"
                            />
                            <button 
                              onClick={() => handleUpdateProgress(goal.id, tempProgress)}
                              className="text-[10px] text-primary font-bold"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 cursor-pointer hover:text-[#111827] transition-colors" onClick={() => {
                            setEditingProgressId(goal.id);
                            setTempProgress(goal.current);
                          }}>
                            <span>{goal.current} / {goal.target} {goal.unit}</span>
                            <Edit3 className="w-3 h-3" />
                          </div>
                        )}
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#111827] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter">Deadline</span>
                        <span className="text-xs font-bold text-[#111827]">{goal.endDate || 'No deadline'}</span>
                      </div>
                      <button 
                        onClick={() => setSelectedGoal(goal)}
                        className="px-4 py-1.5 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-[#111827] rounded-lg transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
        )}
      </div>

      {selectedGoal && (
        <GoalDetailsModal 
          goal={selectedGoal} 
          onClose={() => setSelectedGoal(null)} 
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-6 border-b border-border flex justify-between items-center bg-white sticky top-0">
              <h2 className="text-xl font-bold text-[#111827]">New Goal</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleAddGoal} className="p-8 space-y-6 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Goal Name *</label>
                <input 
                  required 
                  type="text" 
                  value={newGoal.name} 
                  onChange={e => setNewGoal({...newGoal, name: e.target.value})} 
                  placeholder="e.g. 100 Days of Exercise"
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-lg focus:ring-1 focus:ring-black outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Category</label>
                  <select 
                    value={newGoal.category} 
                    onChange={e => setNewGoal({...newGoal, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                  >
                    <option>Personal</option>
                    <option>Professional</option>
                    <option>Health</option>
                    <option>Finance</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Type</label>
                  <select 
                    value={newGoal.type} 
                    onChange={e => setNewGoal({...newGoal, type: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                  >
                    <option>Count</option>
                    <option>Binary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Target</label>
                  <input 
                    type="number" 
                    value={newGoal.target} 
                    onChange={e => setNewGoal({...newGoal, target: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Unit</label>
                  <select 
                    value={newGoal.unit} 
                    onChange={e => setNewGoal({...newGoal, unit: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                  >
                    <option>days</option>
                    <option>hours</option>
                    <option>sessions</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Current Progress</label>
                  <input 
                    type="number" 
                    value={newGoal.current} 
                    onChange={e => setNewGoal({...newGoal, current: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Link to Habit</label>
                  <select 
                    value={newGoal.habitId} 
                    onChange={e => setNewGoal({...newGoal, habitId: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                  >
                    <option value="None">None</option>
                    {habits.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Start Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={newGoal.startDate} 
                      onChange={e => setNewGoal({...newGoal, startDate: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">End Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={newGoal.endDate} 
                      onChange={e => setNewGoal({...newGoal, endDate: e.target.value})}
                      placeholder="dd-mm-yyyy"
                      className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Description</label>
                <textarea 
                  rows={3}
                  value={newGoal.description} 
                  onChange={e => setNewGoal({...newGoal, description: e.target.value})}
                  placeholder="Optional notes..."
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-lg outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="saveTemplate" 
                  checked={newGoal.isTemplate}
                  onChange={e => setNewGoal({...newGoal, isTemplate: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" 
                />
                <label htmlFor="saveTemplate" className="text-sm font-medium text-text-primary">Save as template</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-8 sticky bottom-0 bg-white py-4">
                 <button type="submit" className="w-full py-3 bg-[#111827] text-white rounded-lg font-bold">Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
