export default function StatCard({ label, value, trend, subtext, progress, progressLabel, icon, centerValue, largeRing }) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-card transition-all duration-200 hover:shadow-md">
      <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-center justify-between gap-4">
        {!centerValue && !largeRing && (
          <div>
            <p className="text-text-primary text-[32px] font-bold leading-none">{value}</p>
            {trend && <p className="text-success text-xs font-medium mt-1">{trend}</p>}
            {subtext && <p className="text-text-secondary text-xs mt-1">{subtext}</p>}
          </div>
        )}
        {progress !== undefined && (
          <div className={`relative shrink-0 ${largeRing ? 'w-24 h-24' : 'w-16 h-16'}`}>
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-border"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-success"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${progress}, 100`}
                fill="none"
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-bold text-text-primary ${largeRing ? 'text-2xl' : 'text-sm'}`}>
                {centerValue ?? `${progress}%`}
              </span>
              {progressLabel && largeRing && (
                <span className="text-text-secondary text-xs mt-0.5">{progressLabel}</span>
              )}
            </span>
          </div>
        )}
        {progressLabel && !progress && !largeRing && (
          <p className="text-text-secondary text-xs">{progressLabel}</p>
        )}
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    </div>
  );
}
