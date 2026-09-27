import React from 'react';
import { ISSUE_TYPES } from '../data/issueTypes';
import { 
  AlertTriangle, 
  Footprints, 
  Signpost, 
  ShieldAlert, 
  Lightbulb, 
  Trash2, 
  Trees, 
  HelpCircle,
  Check
} from 'lucide-react';

const iconMap = {
  AlertTriangle,
  Footprints,
  Signpost,
  ShieldAlert,
  Lightbulb,
  Trash2,
  Trees,
  HelpCircle
};

export default function IssueSelector({ selectedIssue, onSelectIssue }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-800">
          1. Bildirmek İstediğiniz Sorun Türünü Seçin
        </label>
        <span className="text-xs text-slate-500 font-medium">Zorunlu</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {ISSUE_TYPES.map((issue) => {
          const IconComponent = iconMap[issue.icon] || AlertTriangle;
          const isSelected = selectedIssue?.id === issue.id;

          return (
            <button
              type="button"
              key={issue.id}
              onClick={() => onSelectIssue(issue)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2 cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-blue-100 text-blue-800 font-semibold' : 'bg-slate-100 text-slate-600'
                }`}>
                  {issue.badge}
                </span>
              </div>

              <div>
                <h4 className={`text-sm font-semibold ${isSelected ? 'text-blue-950' : 'text-slate-800'}`}>
                  {issue.title}
                </h4>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
