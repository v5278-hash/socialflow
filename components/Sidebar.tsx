
import React from 'react';
import { 
  LayoutDashboard, 
  PenSquare, 
  Calendar, 
  BarChart3, 
  Users2, 
  Settings, 
  BookOpen,
  Clock
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'composer', label: 'Composer', icon: PenSquare },
    { id: 'scheduled', label: 'Scheduled', icon: Clock },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'accounts', label: 'Accounts', icon: Users2 },
    { id: 'research', label: 'API Research', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 h-screen sticky top-0 flex flex-col transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">SocialFlow</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t dark:border-slate-800">
        <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-4 text-white">
          <p className="text-xs font-semibold text-indigo-400 mb-1">PRO PLAN</p>
          <p className="text-sm font-medium mb-3">Unlimited AI generation unlocked</p>
          <div className="w-full bg-slate-700 rounded-full h-1.5 mb-3">
            <div className="bg-indigo-500 h-1.5 rounded-full w-3/4"></div>
          </div>
          <button className="text-xs text-center w-full bg-white/10 hover:bg-white/20 py-1.5 rounded-lg transition-colors">
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
