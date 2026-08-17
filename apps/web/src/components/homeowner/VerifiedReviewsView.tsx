import React from 'react';
import { ReviewItem } from '../../types';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const VerifiedReviewsView: React.FC = () => {
  const reviews: ReviewItem[] = [
    {
      id: 'rvw-1',
      targetId: 'bld-prof-1',
      targetType: 'BUILDER',
      authorId: 'usr-homeowner-1',
      authorName: 'Rajesh Kumar',
      rating: 5,
      qualityRating: 5,
      timelinessRating: 5,
      communicationRating: 5,
      comment: 'Apex Infrastructure executed our foundation RCC pour cleanly and ahead of schedule. Transparent site updates!',
      isVerifiedInteraction: true,
      interactionId: 'prj-101',
      createdAt: '2026-03-20T10:00:00.000Z'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Verified Interaction Reviews & Trust System</h1>
          <p className="text-xs text-slate-500 mt-1">Anti-fraud verified reviews — Ratings allowed only after completed contracts or orders</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-800">Verified Interaction Badges</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{r.authorName}</h3>
                <span className="text-[10px] text-slate-400 font-medium">Reviewed Apex Infrastructure</span>
              </div>
              <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Completed Project</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-amber-500 font-bold text-sm">
              {[...Array(r.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
              <span className="text-slate-800 text-xs ml-2 font-bold">{r.rating}.0 / 5.0</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed italic">"{r.comment}"</p>

            <span className="text-[11px] text-slate-400 block pt-2 border-t border-slate-100">
              Reviewed on {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
