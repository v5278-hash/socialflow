
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import PostComposer from './components/PostComposer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ResearchTable from './components/ResearchTable';
import { SocialAccount, SocialPlatform, Post, PlatformStatus } from './types';
import { 
  Plus, 
  Search, 
  Bell, 
  Link as LinkIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sun,
  Moon,
  ArrowRight,
  X,
  LayoutDashboard,
  Calendar as CalendarIcon,
  Trash2,
  Edit2,
  Loader2,
  ShieldCheck,
  FileText,
  // Added Layers to fix the missing import error
  Layers
} from 'lucide-react';
import { PLATFORM_CONFIGS } from './constants';

const MOCK_ACCOUNTS: SocialAccount[] = [
  { id: '1', platform: SocialPlatform.LINKEDIN, username: 'socialflow_pro', avatar: 'https://picsum.photos/200', isConnected: true, type: 'Business', followers: 1240, lastSync: new Date() },
  { id: '2', platform: SocialPlatform.FACEBOOK, username: 'SocialFlowPage', avatar: 'https://picsum.photos/201', isConnected: true, type: 'Business', followers: 8400, lastSync: new Date() },
  { id: '3', platform: SocialPlatform.INSTAGRAM, username: '@sf_hq', avatar: 'https://picsum.photos/202', isConnected: true, type: 'Business', followers: 3200, lastSync: new Date() },
  { id: '4', platform: SocialPlatform.TWITTER, username: 'socialflow', avatar: 'https://picsum.photos/203', isConnected: false, type: 'Personal', followers: 0 },
];

const MOCK_SCHEDULED: Post[] = [
  { id: 's1', content: 'Excited to announce our Q3 partnership with global tech giants! Stay tuned. #TechNews', media: [], platforms: [SocialPlatform.LINKEDIN, SocialPlatform.TWITTER], status: 'Scheduled', platformStatuses: { [SocialPlatform.LINKEDIN]: 'Scheduled', [SocialPlatform.TWITTER]: 'Scheduled' }, scheduledAt: new Date(Date.now() + 86400000) },
  { id: 's2', content: 'Customer spotlight of the week: How Sarah improved her workflow by 40%.', media: [], platforms: [SocialPlatform.FACEBOOK], status: 'Scheduled', platformStatuses: { [SocialPlatform.FACEBOOK]: 'Scheduled' }, scheduledAt: new Date(Date.now() + 172800000) },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<number | null>(0);
  const [accounts, setAccounts] = useState<SocialAccount[]>(MOCK_ACCOUNTS);
  const [scheduledPosts, setScheduledPosts] = useState<Post[]>(MOCK_SCHEDULED);
  const [draftPosts, setDraftPosts] = useState<Post[]>([]);
  const [isConnecting, setIsConnecting] = useState<SocialPlatform | null>(null);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
    const visited = localStorage.getItem('onboarded');
    if (visited) setOnboardingStep(null);
  }, []);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    if (newDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const simulateOAuth = (platform: SocialPlatform) => {
    setIsConnecting(platform);
    setTimeout(() => {
      setAccounts(prev => prev.map(acc => {
        if (acc.platform === platform) {
          return { ...acc, isConnected: true, username: `@connected_${platform.toLowerCase()}`, lastSync: new Date() };
        }
        return acc;
      }));
      setIsConnecting(null);
    }, 2000);
  };

  const closeOnboarding = () => {
    setOnboardingStep(null);
    localStorage.setItem('onboarded', 'true');
  };

  const nextOnboarding = () => {
    const steps = [
      { title: "Welcome to SocialFlow Pro", desc: "Your all-in-one hub for AI-powered social media growth.", highlight: null },
      { title: "The Creative Engine", desc: "Generate viral text, images, and cinematic Veo videos in seconds.", highlight: "composer" },
      { title: "Insight Intelligence", desc: "Track every like and share across all platforms in real-time.", highlight: "analytics" },
    ];
    if (onboardingStep! < steps.length - 1) {
      const nextStep = onboardingStep! + 1;
      setOnboardingStep(nextStep);
      const highlight = steps[nextStep].highlight;
      if (highlight) setActiveTab(highlight);
    } else {
      closeOnboarding();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center">
              <div><h1 className="text-2xl font-bold dark:text-white transition-colors">Good morning, Alex!</h1><p className="text-slate-500 dark:text-slate-400">Social performance is looking strong.</p></div>
              <button onClick={() => setActiveTab('composer')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"><Plus className="w-4 h-4" /> Create Post</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800 shadow-sm">
                  <h3 className="text-lg font-bold dark:text-white mb-6">Connected Channels</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {accounts.map(acc => (
                      <div key={acc.id} className="flex items-center justify-between p-4 rounded-xl border dark:border-slate-800 hover:border-indigo-100 transition-colors">
                        <div className="flex items-center gap-3"><img src={acc.avatar} className="w-10 h-10 rounded-full" alt="" /><div><p className="text-sm font-bold dark:text-slate-200">{acc.username}</p><p className="text-xs text-slate-400 font-medium">{acc.platform}</p></div></div>
                        {acc.isConnected ? <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 font-bold px-2 py-1 rounded-full">CONNECTED</span> : <button onClick={() => simulateOAuth(acc.platform)} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold px-3 py-1.5 rounded-full hover:bg-indigo-600 hover:text-white transition-all">OAUTH CONNECT</button>}
                      </div>
                    ))}
                  </div>
                </div>
                <AnalyticsDashboard />
              </div>
              <div className="space-y-6">
                <div className="bg-slate-900 dark:bg-indigo-950 text-white p-6 rounded-xl shadow-xl">
                  <h3 className="text-sm font-bold text-indigo-400 mb-4 uppercase tracking-widest">Next Post</h3>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10"><p className="text-xs font-bold text-indigo-400 mb-2">IN 14 HOURS</p><p className="text-sm font-medium line-clamp-2">"Excited to announce our Q3 partnership..."</p></div>
                </div>
                {draftPosts.length > 0 && (
                   <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800">
                    <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-widest">Recent Drafts</h3>
                    {draftPosts.slice(0, 3).map(d => (
                      <div key={d.id} className="text-xs py-2 border-b dark:border-slate-800 last:border-none flex justify-between items-center"><span className="line-clamp-1 dark:text-slate-300">{d.content}</span><button onClick={() => setActiveTab('composer')} className="text-indigo-600 font-bold">Edit</button></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'composer': return <PostComposer connectedAccounts={accounts} onPostScheduled={(p) => { setScheduledPosts([...scheduledPosts, p]); setActiveTab('scheduled'); }} onSaveDraft={(p) => { setDraftPosts([...draftPosts, p]); alert("Draft saved successfully!"); }} />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'research': return <ResearchTable />;
      case 'scheduled':
        return (
          <div className="space-y-6 animate-in fade-in">
             <h1 className="text-2xl font-bold dark:text-white">Upcoming Queue</h1>
             <div className="grid grid-cols-1 gap-4">
               {scheduledPosts.map(post => (
                 <div key={post.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800 flex items-start gap-6 group hover:shadow-md transition-all">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center border dark:border-slate-700">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">{post.scheduledAt?.toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-2xl font-bold dark:text-white">{post.scheduledAt?.getDate()}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3 pb-3 border-b dark:border-slate-800/50">
                        {post.platforms.map(p => (
                          <div key={p} className="flex items-center gap-2 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded border dark:border-slate-700">
                            {PLATFORM_CONFIGS[p].icon}<span className="text-[10px] font-bold text-slate-500">{post.platformStatuses[p] || 'Scheduled'}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">{post.content}</p>
                      <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase">
                         <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-indigo-500" /> {post.scheduledAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         {post.overrides && <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-indigo-500" /> CUSTOM OVERRIDES</span>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setScheduledPosts(prev => prev.filter(p => p.id !== post.id))} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                 </div>
               ))}
               {scheduledPosts.length === 0 && <div className="p-12 text-center text-slate-500">No scheduled posts found.</div>}
             </div>
          </div>
        );
      case 'accounts':
        return (
          <div className="space-y-6">
             <h1 className="text-2xl font-bold dark:text-white">Account Manager</h1>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map(acc => (
                  <div key={acc.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4"><img src={acc.avatar} className="w-14 h-14 rounded-full" alt="" />{PLATFORM_CONFIGS[acc.platform].icon}</div>
                    <h3 className="font-bold text-lg dark:text-white mb-1">{acc.username}</h3>
                    <p className="text-xs text-slate-400 mb-6">{acc.platform} {acc.type}</p>
                    <button onClick={() => simulateOAuth(acc.platform)} className={`w-full py-2 rounded-xl text-xs font-bold ${acc.isConnected ? 'bg-slate-100 dark:bg-slate-800 text-slate-600' : 'bg-indigo-600 text-white'}`}>{acc.isConnected ? 'Reconnect Channel' : 'Connect OAuth'}</button>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'settings':
          return (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border dark:border-slate-800 transition-colors">
                  <h2 className="text-2xl font-bold mb-6 dark:text-white">Settings</h2>
                  <div className="space-y-6 max-w-md">
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <div><p className="font-bold dark:text-white">Dark Mode</p><p className="text-sm text-slate-500">Enable high-contrast theme</p></div>
                          <button onClick={toggleDarkMode} className={`w-12 h-6 rounded-full transition-all relative ${darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'left-7' : 'left-1'}`} /></button>
                      </div>
                  </div>
              </div>
          );
      default: return null;
    }
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 sticky top-0 z-10 px-8 py-4 flex justify-between items-center transition-colors">
          <div className="relative w-96 hidden sm:block"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search Workspace..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg pl-10 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 dark:text-white" /></div>
          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">{darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block"><p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Alex Rivera</p><p className="text-[10px] text-slate-400 font-bold uppercase">Pro Workspace</p></div>
              <img src="https://picsum.photos/100" className="w-10 h-10 rounded-full border dark:border-slate-700" alt="" />
            </div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">{renderContent()}</div>
      </main>
      {onboardingStep !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-6"><div className="p-3 bg-indigo-600 rounded-2xl"><LayoutDashboard className="w-6 h-6 text-white" /></div><button onClick={closeOnboarding} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button></div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">SocialFlow Pro</h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">Ready to supercharge your social growth with AI?</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5"><div className="w-8 h-1.5 bg-indigo-600 rounded-full" /><div className="w-2 h-1.5 bg-slate-200 rounded-full" /><div className="w-2 h-1.5 bg-slate-200 rounded-full" /></div>
              <button onClick={nextOnboarding} className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2">Next Step <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
