import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  let styleClass = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status.toUpperCase()) {
    case 'VERIFIED':
    case 'COMPLETED':
    case 'ACCEPTED':
    case 'DELIVERED':
      styleClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'IN_PROGRESS':
    case 'PROCESSING':
    case 'PENDING':
    case 'REQUESTED':
      styleClass = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'REJECTED':
    case 'CANCELLED':
    case 'DELAYED':
      styleClass = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'PLANNED':
      styleClass = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styleClass} ${className}`}>
      {status.replace('_', ' ')}
    </span>
  );
};
