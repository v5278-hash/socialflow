
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MousePointer2, 
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
  BarChart2,
  Share2,
  Heart
} from 'lucide-react';
import { Post } from '../types';

const data = [
  { name: 'Mon', engagement: 4000, reach: 2400 },
  { name: 'Tue', engagement: 3000, reach: 1398 },
  { name: 'Wed', engagement: 2000, reach: 9800 },
  { name: 'Thu', engagement: 2780, reach: 3908 },
  { name: 'Fri', engagement: 1890, reach: 4800 },
  { name: 'Sat', engagement: 2390, reach: 3800 },
  { name: 'Sun', engagement: 3490, reach: 4300 },
];

const MOCK_RECENT_POSTS: Post[] = [
  // Fix: Added missing required platformStatuses property to mock posts
  { id: '1', content: 'Our new AI engine is live! 🚀 Check out how it crafts perfect social copy.', media: [], platforms: [], status: 'Published', platformStatuses: {}, publishedAt: new Date(), metrics: { likes: 432, shares: 121, comments: 45 } },
  { id: '2', content: 'Cinematic video generation is here. Experience SocialFlow Veo.', media: [], platforms: [], status: 'Published', platformStatuses: {}, publishedAt: new Date(), metrics: { likes: 890, shares: 432, comments: 89 } },
  { id: '3', content: '3 Tips for organic growth in 2025. Save this for later!', media: [], platforms: [], status: 'Published', platformStatuses: {}, publishedAt: new Date(), metrics: { likes: 312, shares: 89, comments: 23 } },
  { id: '4', content: 'Behind the scenes at the SocialFlow HQ.', media: [], platforms: [], status: 'Published', platformStatuses: {}, publishedAt: new Date(), metrics: { likes: 145, shares: 12, comments: 18 } },
  { id: '5', content: 'Why cross-posting is your secret weapon.', media: [], platforms: [], status: 'Published', platformStatuses: {}, publishedAt: new Date(), metrics: { likes: 567, shares: 234, comments: 67 } },
];

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 shadow-sm transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
        <Icon className="w-6 h-6" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        {change}%
      </div>
    </div>
    <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h4>
    <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{value}</p>
  </div>
);

const AnalyticsDashboard: React.FC = () => {
  const topPost = MOCK_RECENT_POSTS.reduce((prev, current) => 
    (current.metrics!.likes + current.metrics!.shares > prev.metrics!.likes + prev.metrics!.shares) ? current : prev
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Engagement" value="24.8k" change="12.5" trend="up" icon={TrendingUp} />
        <StatCard title="New Followers" value="1,294" change="3.2" trend="up" icon={Users} />
        <StatCard title="Post Clicks" value="8,492" change="1.8" trend="down" icon={MousePointer2} />
        <StatCard title="Direct Comments" value="431" change="24.1" trend="up" icon={MessageSquare} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Engagement Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}}
                  itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="engagement" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border dark:border-slate-700 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Reach by Platform</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.05)'}} contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                <Bar dataKey="reach" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Posts Performance Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-indigo-500" /> Recent Post Performance
          </h3>
          <div className="flex gap-4">
             <div className="text-center px-4">
               <p className="text-[10px] font-bold text-slate-400 uppercase">AVG Likes</p>
               <p className="text-lg font-bold dark:text-white">469</p>
             </div>
             <div className="text-center px-4">
               <p className="text-[10px] font-bold text-slate-400 uppercase">AVG Shares</p>
               <p className="text-lg font-bold dark:text-white">177</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Post Spotlight */}
          <div className="lg:col-span-1">
             <div className="bg-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
                <Trophy className="absolute -right-4 -top-4 w-24 h-24 text-white/10" />
                <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">🏆 TOP PERFORMING</span>
                <p className="text-lg font-medium leading-relaxed mb-6 line-clamp-3">"{topPost.content}"</p>
                <div className="flex justify-between border-t border-white/20 pt-4">
                  <div className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> {topPost.metrics?.likes}</div>
                  <div className="flex items-center gap-1.5"><Share2 className="w-4 h-4" /> {topPost.metrics?.shares}</div>
                  <div className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> {topPost.metrics?.comments}</div>
                </div>
             </div>
          </div>

          {/* List of Recent 5 Posts */}
          <div className="lg:col-span-2 space-y-4">
             {MOCK_RECENT_POSTS.map((post, idx) => (
               <div key={post.id} className="flex items-center gap-4 p-4 rounded-xl border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400">#{idx+1}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-200 line-clamp-1 mb-1">{post.content}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{post.publishedAt?.toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{post.metrics?.likes}</p>
                      <p className="text-[10px] text-slate-400 font-bold">LIKES</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{post.metrics?.shares}</p>
                      <p className="text-[10px] text-slate-400 font-bold">SHARES</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{post.metrics?.comments}</p>
                      <p className="text-[10px] text-slate-400 font-bold">REPLIES</p>
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
