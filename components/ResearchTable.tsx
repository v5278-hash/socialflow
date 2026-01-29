
import React, { useState } from 'react';
import { API_RESEARCH_DATA } from '../constants';
import { SocialPlatform } from '../types';
import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';

const ResearchTable: React.FC = () => {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  const toggleExpand = (platform: string) => {
    setExpandedPlatform(expandedPlatform === platform ? null : platform);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div className="p-6 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">API Deep Research & Blueprints</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Strategic status of social media APIs as of 2025.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/20 border-b dark:border-slate-800">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Platform</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Free API?</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800">
            {API_RESEARCH_DATA.map((item) => (
              <React.Fragment key={item.platform}>
                <tr 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => toggleExpand(item.platform)}
                >
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 dark:text-slate-200">{item.platform}</span>
                  </td>
                  <td className="px-6 py-4">
                    {item.isFree ? (
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" /> YES
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                        <XCircle className="w-4 h-4" /> NO
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {expandedPlatform === item.platform ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      View Specs
                    </button>
                  </td>
                </tr>
                {expandedPlatform === item.platform && (
                  <tr className="bg-slate-50 dark:bg-slate-800/30">
                    <td colSpan={3} className="px-6 py-6 border-b dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Limitations
                          </h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {item.limitations}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                            <Info className="w-3 h-3" /> Workarounds
                          </h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {item.workarounds}
                          </p>
                        </div>
                        <div className="md:col-span-2 p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/30 rounded-xl">
                          <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase mb-1">Strategic Recommendation</h4>
                          <p className="text-sm text-indigo-900 dark:text-indigo-200">{item.recommendation}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-8 bg-slate-900 text-white">
        <h3 className="text-lg font-bold mb-4">Architecture Blueprint</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-indigo-400 font-bold mb-2">Tech Stack</h4>
            <p className="text-sm text-slate-300 leading-relaxed">Node.js (Express), Redis for job queuing, AES-256 for token encryption, and Hostinger Cron for scheduling.</p>
          </div>
          <div>
            <h4 className="text-indigo-400 font-bold mb-2">Deployment Strategy</h4>
            <p className="text-sm text-slate-300 leading-relaxed">Leverage Hostinger's Git-sync and automated daily backups for mission-critical reliability.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchTable;
