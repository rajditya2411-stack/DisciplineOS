import { useState, useMemo } from 'react';
import { useHabits } from '../../context/HabitsContext';
import { useTimeBlocks } from '../../context/TimeBlocksContext';
import { useMissedLogs } from '../../context/MissedLogsContext';
import { AlertCircle, FileText, Trash2, Plus, X } from 'lucide-react';

export default function MissedLogs() {
  const { habits, completions } = useHabits();
  const { blocks } = useTimeBlocks();
  const { missedReasons, addReason, updateReason, deleteReason, getReasonsForTask } = useMissedLogs();
  const [expandedTask, setExpandedTask] = useState(null);
  const [reasonText, setReasonText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Generate missed logs for the last 30 days (both habits and time blocks)
  const missedLogs = useMemo(() => {
    const logs = [];
    const now = new Date();
    
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (dateStr > now.toISOString().split('T')[0]) continue; // Don't show future dates
      
      const dayCompletions = completions[dateStr] || {};
      const dayBlocks = blocks.filter(b => b.date === dateStr);
      
      // Missed habits
      const missedHabits = habits.filter(h => !dayCompletions[h.id]).map(h => ({
        id: h.id,
        name: h.name,
        type: 'habit'
      }));
      
      // Incomplete time blocks
      const incompleteBlocks = dayBlocks.filter(b => !b.done).map(b => ({
        id: b.id,
        name: b.title,
        type: 'block'
      }));
      
      const missed = [...missedHabits, ...incompleteBlocks];
      
      if (missed.length > 0) {
        logs.push({
          date: dateStr,
          items: missed,
          totalMissed: missed.length
        });
      }
    }
    return logs;
  }, [habits, completions, blocks]);

  const totalMissed = missedLogs.reduce((acc, curr) => acc + curr.totalMissed, 0);

  const handleAddReason = (taskId, taskName, date, taskType) => {
    if (!reasonText.trim()) return;
    addReason(taskId, taskName, date, reasonText, taskType);
    setReasonText('');
  };

  const handleUpdateReason = (id) => {
    if (!editText.trim()) return;
    updateReason(id, editText);
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
          <AlertCircle className="w-8 h-8 text-danger" /> 
          Missed Logs & Reasons
        </h1>
        <div className="text-right">
          <div className="text-4xl font-black text-text-primary">{totalMissed}</div>
          <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Total Incomplete Tasks</p>
        </div>
      </div>

      {missedLogs.length === 0 ? (
        <div className="bg-card rounded-2xl p-12 border border-border text-center">
          <FileText className="w-12 h-12 text-border mx-auto mb-3" />
          <p className="text-text-secondary font-medium">Perfect! No missed tasks in the last 30 days.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {missedLogs.map((log) => (
            <div key={log.date} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border bg-background/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    {new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-danger">{log.totalMissed}</span>
                  <span className="text-xs text-text-secondary font-bold uppercase ml-2">Incomplete</span>
                </div>
              </div>

              <div className="divide-y divide-border">
                {log.items.map((item) => {
                  const reasons = getReasonsForTask(item.id, log.date);
                  const isExpanded = expandedTask === `${item.id}-${log.date}`;
                  
                  return (
                    <div key={`${item.id}-${log.date}`} className="p-6">
                      <div 
                        className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setExpandedTask(isExpanded ? null : `${item.id}-${log.date}`)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-3 h-3 rounded-full ${item.type === 'habit' ? 'bg-primary' : 'bg-secondary'}`} />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-text-primary">{item.name}</p>
                            <p className="text-xs text-text-secondary uppercase font-bold">{item.type === 'habit' ? 'Habit' : 'Time Block'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {reasons.length > 0 && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-bold">
                              {reasons.length} {reasons.length === 1 ? 'reason' : 'reasons'}
                            </span>
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-border space-y-4">
                          {/* Existing Reasons */}
                          {reasons.length > 0 && (
                            <div className="space-y-2">
                              {reasons.map(reason => (
                                <div key={reason.id} className="bg-background/50 rounded-lg p-3 flex items-start justify-between">
                                  {editingId === reason.id ? (
                                    <div className="flex-1 flex gap-2">
                                      <input
                                        autoFocus
                                        type="text"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="flex-1 bg-card border border-primary/30 rounded px-2 py-1 text-sm text-text-primary focus:outline-none"
                                      />
                                      <button 
                                        onClick={() => handleUpdateReason(reason.id)}
                                        className="bg-success text-white px-2 py-1 rounded text-xs font-bold"
                                      >
                                        Save
                                      </button>
                                      <button 
                                        onClick={() => setEditingId(null)}
                                        className="text-text-secondary hover:text-danger transition-colors"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <p className="text-sm text-text-primary flex-1">{reason.reason}</p>
                                      <div className="flex items-center gap-2 ml-3">
                                        <button 
                                          onClick={() => {
                                            setEditingId(reason.id);
                                            setEditText(reason.reason);
                                          }}
                                          className="text-text-secondary hover:text-primary transition-colors text-xs"
                                        >
                                          Edit
                                        </button>
                                        <button 
                                          onClick={() => deleteReason(reason.id)}
                                          className="text-text-secondary hover:text-danger transition-colors"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add New Reason */}
                          {editingId !== `add-${item.id}-${log.date}` ? (
                            <button
                              onClick={() => {
                                setEditingId(`add-${item.id}-${log.date}`);
                                setReasonText('');
                              }}
                              className="w-full flex items-center justify-center gap-2 text-sm font-bold text-primary hover:bg-primary/10 p-2 rounded transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              Add Reason
                            </button>
                          ) : (
                            <div className="flex gap-2">
                              <input
                                autoFocus
                                type="text"
                                value={reasonText}
                                onChange={(e) => setReasonText(e.target.value)}
                                placeholder="Why wasn't this completed?"
                                className="flex-1 bg-card border border-primary/30 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddReason(item.id, item.name, log.date, item.type);
                                    setEditingId(null);
                                  }
                                }}
                              />
                              <button
                                onClick={() => {
                                  handleAddReason(item.id, item.name, log.date, item.type);
                                  setEditingId(null);
                                }}
                                className="bg-primary text-white px-3 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-text-secondary hover:text-danger transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
