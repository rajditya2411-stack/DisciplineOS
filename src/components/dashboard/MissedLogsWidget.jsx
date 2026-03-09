import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MissedLogsWidget() {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/missed-logs')}
      className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-danger" />
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Missed Logs</h3>
        </div>
      </div>
      
      <div className="text-center py-4">
        <p className="text-sm text-text-secondary italic">Click to view missed tasks and add reasons</p>
      </div>
    </div>
  );
}
