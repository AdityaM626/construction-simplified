import React from 'react';

export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 animate-pulse space-y-3">
          <div className="h-4 bg-slate-200 rounded-md w-1/3"></div>
          <div className="h-3 bg-slate-100 rounded-md w-2/3"></div>
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="h-8 bg-slate-100 rounded-lg"></div>
            <div className="h-8 bg-slate-100 rounded-lg"></div>
            <div className="h-8 bg-slate-100 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
