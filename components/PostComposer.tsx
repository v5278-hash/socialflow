
import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  Smile, 
  Sparkles, 
  Clock, 
  Send,
  X,
  Plus,
  PenSquare,
  Wand2,
  Loader2,
  FileText,
  Video as VideoIcon,
  Play,
  AlertTriangle,
  GripHorizontal,
  Calendar,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Repeat,
  Heart,
  Share2,
  Layers,
  Save,
  Check,
  Type,
  Lightbulb,
  Info,
  ShieldCheck
} from 'lucide-react';
import { SocialPlatform, SocialAccount, MediaItem, Post, PlatformStatus, PostOverride } from '../types';
import { PLATFORM_CONFIGS } from '../constants';
import { 
  generateSocialCaptions, 
  generateSocialImage, 
  generateSocialVideo,
  summarizePost 
} from '../services/geminiService';

interface PostComposerProps {
  connectedAccounts: SocialAccount[];
  onPostScheduled?: (post: Post) => void;
  onSaveDraft?: (post: Post) => void;
}

const AI_IMAGE_PROMPTS = [
  "Minimalist desk setup with a neon glowing laptop",
  "Cyberpunk city street in the rain with purple lighting",
  "Abstract futuristic network connections in 3D",
  "Friendly robot holding a cup of coffee"
];

const AI_IMAGE_STYLES = [
  "Photorealistic", "Cinematic", "3D Render", "Digital Art", "Vector Illustration", "Oil Painting", "Synthwave"
];

const AI_VIDEO_PROMPTS = [
  "Cinematic drone shot over a mountain range at sunset",
  "Technological circuits lighting up in a digital brain",
  "Calm ocean waves crashing on a black sand beach",
  "Slow motion close-up of a high-tech robotic hand"
];

const AI_TEXT_TOPICS = [
  "Announcing a major Q3 product launch",
  "Sharing 5 tips for sustainable productivity",
  "Celebrating a team milestone and growth",
  "Inviting users to a live AI masterclass"
];

const PostComposer: React.FC<PostComposerProps> = ({ connectedAccounts, onPostScheduled, onSaveDraft }) => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform | null>(null);
  
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [showVideoGenerator, setShowVideoGenerator] = useState(false);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  const [imagePrompt, setImagePrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Individual tuning state
  const [isIndividualTuning, setIsIndividualTuning] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, PostOverride>>({});

  const handlePlatformToggle = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
    if (!previewPlatform) setPreviewPlatform(platform);
  };

  const selectAllPlatforms = () => {
    const all = connectedAccounts.filter(a => a.isConnected).map(a => a.platform);
    setSelectedPlatforms(all);
    if (all.length > 0) setPreviewPlatform(all[0]);
  };

  const handleAiTextGenerate = async () => {
    if (!content) return;
    setError(null);
    setIsGeneratingText(true);
    setAiSuggestions([]);
    try {
      const result = await generateSocialCaptions(content, previewPlatform || selectedPlatforms[0] || 'Social Media');
      if (result && result.variations) {
        setAiSuggestions(result.variations);
      } else {
        throw new Error("Failed to generate captions. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during text generation.");
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleSummarize = async () => {
    if (!content) return;
    setError(null);
    setIsGeneratingText(true);
    try {
      const summary = await summarizePost(content);
      if (summary) updateContent(summary);
      else throw new Error("Summarization failed.");
    } catch (err: any) {
      setError("AI was unable to summarize the post. Ensure the text isn't too short.");
    } finally {
      setIsGeneratingText(false);
    }
  };

  const simulateUpload = (id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 30);
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setMediaItems(prev => prev.map(m => m.id === id ? { ...m, uploadProgress: progress } : m));
    }, 200);
  };

  const handleAiImageGenerate = async (explicitPrompt?: string) => {
    const prompt = explicitPrompt || imagePrompt;
    if (!prompt) return;
    setError(null);
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateSocialImage(prompt);
      if (imageUrl) {
        const newItem: MediaItem = { id: Date.now().toString(), url: imageUrl, type: 'image', uploadProgress: 0 };
        setMediaItems(prev => [...prev, newItem]);
        simulateUpload(newItem.id);
        setShowImageGenerator(false);
        setImagePrompt('');
      } else {
        throw new Error("Image engine returned no result.");
      }
    } catch (err: any) {
      setError("Image generation failed. Try a more descriptive prompt.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleAiVideoGenerate = async () => {
    if (!videoPrompt) return;
    setError(null);
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
    }

    setIsGeneratingVideo(true);
    try {
      const videoUrl = await generateSocialVideo(videoPrompt, setVideoProgress);
      if (videoUrl) {
        const newItem: MediaItem = { id: Date.now().toString(), url: videoUrl, type: 'video', uploadProgress: 0 };
        setMediaItems(prev => [...prev, newItem]);
        simulateUpload(newItem.id);
        setShowVideoGenerator(false);
        setVideoPrompt('');
      }
    } catch (err: any) {
      if (err.message === 'KEY_RESET') {
        setError("Veo API Key reset required. Please select a valid project.");
      } else {
        setError("Video production failed. This can happen with complex prompts.");
      }
    } finally {
      setIsGeneratingVideo(false);
      setVideoProgress('');
    }
  };

  const currentContent = isIndividualTuning && previewPlatform && overrides[previewPlatform] 
    ? overrides[previewPlatform].content 
    : content;

  const currentMedia = isIndividualTuning && previewPlatform && overrides[previewPlatform]
    ? overrides[previewPlatform].media
    : mediaItems;

  const updateContent = (val: string) => {
    if (isIndividualTuning && previewPlatform) {
      setOverrides(prev => ({
        ...prev,
        [previewPlatform]: {
          content: val,
          media: prev[previewPlatform]?.media || [...mediaItems]
        }
      }));
    } else {
      setContent(val);
    }
  };

  const removeMedia = (id: string) => {
    if (isIndividualTuning && previewPlatform) {
      setOverrides(prev => ({
        ...prev,
        [previewPlatform]: {
          content: prev[previewPlatform]?.content || content,
          media: (prev[previewPlatform]?.media || [...mediaItems]).filter(m => m.id !== id)
        }
      }));
    } else {
      setMediaItems(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleAction = (type: 'Schedule' | 'Draft') => {
    const platformStatuses: Record<string, PlatformStatus> = {};
    selectedPlatforms.forEach(p => platformStatuses[p] = type === 'Schedule' ? 'Scheduled' : 'Draft');

    const postData: Post = {
      id: Date.now().toString(),
      content,
      media: mediaItems,
      platforms: selectedPlatforms,
      status: type === 'Schedule' ? 'Scheduled' : 'Draft',
      platformStatuses,
      overrides: isIndividualTuning ? overrides : undefined,
      scheduledAt: type === 'Schedule' && scheduleDate && scheduleTime ? new Date(`${scheduleDate}T${scheduleTime}`) : undefined,
    };

    if (type === 'Schedule') onPostScheduled?.(postData);
    else onSaveDraft?.(postData);

    if (type === 'Schedule') {
      setContent('');
      setMediaItems([]);
      setSelectedPlatforms([]);
      setOverrides({});
      setShowSchedulePicker(false);
    }
  };

  const applySuggestion = (text: string) => {
    updateContent(text);
    setAiSuggestions([]);
  };

  const appendStyleToPrompt = (style: string) => {
    setImagePrompt(prev => {
      if (prev.includes(style)) return prev;
      return prev ? `${prev}, ${style} style` : `${style} style`;
    });
  };

  const renderPlatformSpecificPreview = (platform: SocialPlatform) => {
    const pContent = (isIndividualTuning && overrides[platform]?.content) || content;
    const pMedia = (isIndividualTuning && overrides[platform]?.media) || mediaItems;

    switch (platform) {
      case SocialPlatform.TWITTER:
        return (
          <div className="p-4">
            <div className="flex gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm dark:text-white">Alex Rivera</span>
                  <span className="text-slate-500 text-sm">@alex_pro · 1m</span>
                </div>
                <div className="text-sm dark:text-slate-100 whitespace-pre-wrap mt-1 leading-normal">
                  {pContent || "Your tweet content..."}
                </div>
              </div>
            </div>
            {pMedia.length > 0 && (
              <div className={`grid gap-0.5 rounded-2xl overflow-hidden border dark:border-slate-800 ${pMedia.length > 1 ? 'grid-cols-2' : ''}`}>
                {pMedia.map(m => (
                  <div key={m.id} className="relative aspect-video bg-slate-100 dark:bg-slate-900">
                    {m.type === 'image' ? <img src={m.url} className="w-full h-full object-cover" alt="" /> : <video src={m.url} className="w-full h-full object-cover" muted />}
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between mt-3 text-slate-500 max-w-[300px]">
              <MessageSquare className="w-4 h-4" /><Repeat className="w-4 h-4" /><Heart className="w-4 h-4" /><Share2 className="w-4 h-4" />
            </div>
          </div>
        );
      case SocialPlatform.INSTAGRAM:
        return (
          <div>
             <div className="p-3 border-b dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[1px]" />
                   <span className="text-xs font-bold dark:text-white">socialflow_hq</span>
                </div>
             </div>
             {pMedia.length > 0 ? (
               <div className="aspect-square bg-slate-50 dark:bg-slate-950 relative">
                  {pMedia[0].type === 'image' ? <img src={pMedia[0].url} className="w-full h-full object-cover" alt="" /> : <video src={pMedia[0].url} className="w-full h-full object-cover" autoPlay loop muted />}
               </div>
             ) : <div className="aspect-square bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 text-xs font-medium">Media Required</div>}
             <div className="p-3">
                <p className="text-xs dark:text-white leading-snug"><span className="font-bold mr-2">socialflow_hq</span>{pContent || "Add a caption..."}</p>
             </div>
          </div>
        );
      default:
        return (
          <div className="p-4">
             <div className="whitespace-pre-wrap text-sm dark:text-slate-300 leading-relaxed mb-4">{pContent || "Post Preview"}</div>
             <div className="grid gap-2 grid-cols-2">
                {pMedia.map(m => (
                  <div key={m.id} className="rounded-xl overflow-hidden border dark:border-slate-800">
                     {m.type === 'image' ? <img src={m.url} className="w-full aspect-square object-cover" alt="" /> : <video src={m.url} className="w-full aspect-square object-cover"/>}
                  </div>
                ))}
             </div>
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 pb-20">
      <div className="lg:col-span-2 space-y-6">
        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5" />
            <div className="flex-1 text-sm"><p className="font-bold text-rose-900 dark:text-rose-200">AI Component Error</p><p className="text-rose-700 dark:text-rose-400">{error}</p></div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 p-6 shadow-sm transition-colors">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold dark:text-white">Composer</h2>
                <button onClick={selectAllPlatforms} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full uppercase tracking-tighter hover:bg-indigo-100 transition-colors">Select Connected</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.values(SocialPlatform).map(p => {
                  const isSelected = selectedPlatforms.includes(p);
                  const isConnected = connectedAccounts.some(acc => acc.platform === p && acc.isConnected);
                  return (
                    <button
                      key={p}
                      onClick={() => handlePlatformToggle(p)}
                      title={`${p} ${isConnected ? '(Connected)' : '(Not Connected)'}`}
                      className={`flex items-center gap-2 p-2 px-3 rounded-lg border dark:border-slate-700 transition-all relative ${
                        isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-500/50 scale-105 shadow-sm' : 'hover:border-slate-300'
                      } ${!isConnected ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}
                    >
                      {PLATFORM_CONFIGS[p].icon}
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>{p}</span>
                      {isConnected && <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-900" />}
                    </button>
                  );
                })}
              </div>
            </div>
            {isIndividualTuning && previewPlatform && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2">
                 <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-300">
                    <Layers className="w-3 h-3" /> TUNING FOR: 
                    <div className="flex items-center gap-1.5 ml-1 px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border dark:border-slate-700">
                       {PLATFORM_CONFIGS[previewPlatform].icon}
                       {previewPlatform.toUpperCase()}
                    </div>
                 </div>
                 <button onClick={() => setIsIndividualTuning(false)} className="text-[10px] text-indigo-400 font-bold hover:underline">Return to Master</button>
              </div>
            )}
          </div>

          <div className="relative group">
            <textarea
              value={currentContent}
              onChange={(e) => updateContent(e.target.value)}
              placeholder={isIndividualTuning ? `Customize content for ${previewPlatform}...` : "Draft your master post here. Use 'AI Rewrite' to optimize."}
              className={`w-full min-h-[220px] p-4 text-lg bg-slate-50 dark:bg-slate-800/50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-colors ${isIndividualTuning ? 'ring-2 ring-indigo-500/10 shadow-inner' : ''}`}
            />
            
            {currentMedia.length > 0 && (
              <div className="absolute bottom-16 left-4 right-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {currentMedia.map(item => (
                  <div key={item.id} className="relative flex-shrink-0 group/media">
                    <img src={item.url} className="w-20 h-20 object-cover rounded-lg border-2 border-white dark:border-slate-700 shadow-md" alt="" />
                    {item.uploadProgress !== undefined && item.uploadProgress < 100 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                        <div className="w-12 h-1 bg-white/30 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 transition-all" style={{width: `${item.uploadProgress}%`}} />
                        </div>
                      </div>
                    )}
                    <button onClick={() => removeMedia(item.id)} className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full hover:scale-110 transition-transform"><X className="w-2 h-2" /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="absolute bottom-4 right-4 flex gap-2 items-center">
               <button onClick={handleSummarize} title="AI Character Shorten" className="p-1.5 text-slate-400 hover:text-indigo-500 transition-colors"><FileText className="w-4 h-4" /></button>
               <span className="text-xs text-slate-400 font-medium">{currentContent.length} chars</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 border-t dark:border-slate-800 pt-6">
            <div className="flex gap-4">
              <button onClick={() => {setShowImageGenerator(!showImageGenerator); setShowVideoGenerator(false); setAiSuggestions([]);}} className="flex items-center gap-2 font-medium text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"><Wand2 className="w-4 h-4" /> AI Image</button>
              <button onClick={() => {setShowVideoGenerator(!showVideoGenerator); setShowImageGenerator(false); setAiSuggestions([]);}} className="flex items-center gap-2 font-medium text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"><VideoIcon className="w-4 h-4" /> AI Video</button>
              <button onClick={handleAiTextGenerate} disabled={isGeneratingText || !currentContent} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm disabled:opacity-50">{isGeneratingText ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} AI Rewrite</button>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => {
                   if (!isIndividualTuning && previewPlatform && !overrides[previewPlatform]) {
                     setOverrides(prev => ({ ...prev, [previewPlatform]: { content, media: [...mediaItems] } }));
                   }
                   setIsIndividualTuning(!isIndividualTuning);
                }} 
                disabled={selectedPlatforms.length === 0}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${isIndividualTuning ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 disabled:opacity-30'}`}
              >
                <Layers className="w-4 h-4" /> Tuning {isIndividualTuning ? 'ON' : 'OFF'}
              </button>
              <button onClick={() => handleAction('Draft')} className="flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 font-bold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg border border-indigo-200 dark:border-indigo-500/30 transition-all">
                <Save className="w-4 h-4" /> Save Draft
              </button>
              <button onClick={() => setShowSchedulePicker(!showSchedulePicker)} className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg border dark:border-slate-700">
                <Clock className="w-4 h-4" /> Schedule
              </button>
              <button onClick={() => handleAction('Schedule')} disabled={selectedPlatforms.length === 0} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 rounded-lg shadow-md disabled:opacity-50 active:scale-95 transition-all"><Send className="w-4 h-4" /> Post Now</button>
            </div>
          </div>
        </div>

        {/* AI Generator Panels */}
        {showImageGenerator && (
          <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-xl border border-indigo-100 dark:border-slate-700 p-6 shadow-sm animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2"><Wand2 className="w-4 h-4" /> Visual AI Artist</h3>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-md text-[10px] font-bold text-indigo-600">
                <Lightbulb className="w-3 h-3" /> PROMPT TIP: Subject + Lighting + Style
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              <input type="text" value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} placeholder="e.g., A floating futuristic city in golden hour..." className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner" />
              <button onClick={() => handleAiImageGenerate()} disabled={isGeneratingImage || !imagePrompt} className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2">
                {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />} Generate
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Quick Prompt Suggestions</span>
                <div className="flex flex-wrap gap-2">
                  {AI_IMAGE_PROMPTS.map(p => (
                    <button key={p} onClick={() => setImagePrompt(p)} className="text-[10px] bg-white dark:bg-slate-700 hover:border-indigo-500 border dark:border-slate-600 px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300 transition-all shadow-sm">
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Style Overlays</span>
                <div className="flex flex-wrap gap-2">
                  {AI_IMAGE_STYLES.map(style => (
                    <button key={style} onClick={() => appendStyleToPrompt(style)} className="text-[10px] bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 px-3 py-1.5 rounded-full font-medium hover:bg-indigo-100 transition-colors">
                      + {style}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border dark:border-slate-700">
                 <p className="text-[10px] text-slate-500 leading-relaxed italic flex gap-2">
                    <Info className="w-3 h-3 flex-shrink-0" />
                    Expert tip: Be specific about lighting (e.g., "Volumetric lighting", "Soft glow") and camera angles (e.g., "Bird's eye view", "Macro close-up") for better results.
                 </p>
              </div>
            </div>
          </div>
        )}

        {showVideoGenerator && (
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xl animate-in slide-in-from-bottom-4">
            <h3 className="text-sm font-bold text-indigo-400 mb-4 flex items-center gap-2"><VideoIcon className="w-4 h-4" /> Veo Motion Studio</h3>
            <textarea value={videoPrompt} onChange={(e) => setVideoPrompt(e.target.value)} placeholder="Cinematic description of movement and mood..." className="w-full bg-slate-800 border-none rounded-lg p-3 text-sm mb-4 outline-none focus:ring-2 focus:ring-indigo-500/30" rows={2} />
            <div className="flex flex-wrap gap-2 mb-4">
               <span className="text-[10px] font-bold text-slate-500 uppercase mr-2 pt-1">Try These:</span>
               {AI_VIDEO_PROMPTS.map(p => <button key={p} onClick={() => setVideoPrompt(p)} className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-1 rounded-full text-slate-400 hover:text-white transition-colors">{p}</button>)}
            </div>
            <button onClick={handleAiVideoGenerate} disabled={isGeneratingVideo || !videoPrompt} className="w-full bg-indigo-600 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 shadow-lg">{isGeneratingVideo ? <><Loader2 className="w-4 h-4 animate-spin" /> {videoProgress || 'Directing...'}</> : 'Action'}</button>
          </div>
        )}

        {/* AI Caption Variations Display */}
        {aiSuggestions.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
             <div className="flex items-center justify-between px-2">
               <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Sparkles className="w-3 h-3 text-indigo-500" /> AI Suggestions for {previewPlatform || 'General'}</h3>
               <button onClick={() => setAiSuggestions([])} className="text-slate-400"><X className="w-3 h-3" /></button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiSuggestions.map((v, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-xl group hover:border-indigo-500 transition-all cursor-pointer shadow-sm" onClick={() => applySuggestion(v.text)}>
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-4 leading-relaxed mb-3">"{v.text}"</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                       {v.hashtags.map((h: string) => <span key={h} className="text-[9px] font-bold text-indigo-500">{h}</span>)}
                    </div>
                    <button className="w-full py-1.5 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all uppercase">Use Version {i+1}</button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Master Topic Ideas for master content */}
        {!showImageGenerator && !showVideoGenerator && aiSuggestions.length === 0 && (
          <div className="p-4 bg-slate-100 dark:bg-slate-800/40 rounded-xl border border-dashed dark:border-slate-700 flex flex-wrap items-center gap-3">
             <span className="text-[10px] font-bold text-slate-400 uppercase">Topic Starters:</span>
             {AI_TEXT_TOPICS.map(t => (
               <button key={t} onClick={() => setContent(t)} className="text-[10px] font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">"{t}"</button>
             ))}
          </div>
        )}

        {showSchedulePicker && (
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-6 shadow-xl animate-in slide-in-from-bottom-4">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-bold dark:text-white">Select Posting Schedule</h3>
               <button onClick={() => setShowSchedulePicker(false)} className="text-slate-400 hover:text-indigo-500 transition-colors"><X className="w-4 h-4" /></button>
             </div>
             <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Date</label><input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-3 text-sm dark:text-white focus:ring-2 focus:ring-indigo-500/20" /></div>
                <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Time</label><input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-3 text-sm dark:text-white focus:ring-2 focus:ring-indigo-500/20" /></div>
             </div>
             <button onClick={() => handleAction('Schedule')} disabled={!scheduleDate || !scheduleTime || selectedPlatforms.length === 0} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50">Confirm Schedule</button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-2 flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Live Previews</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {selectedPlatforms.map(p => (
            <button key={p} onClick={() => setPreviewPlatform(p)} className={`relative flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${previewPlatform === p ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 shadow-md scale-105' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-400'}`}>
              <div className="flex items-center gap-2">
                {PLATFORM_CONFIGS[p].icon}
                {p}
              </div>
              {isIndividualTuning && overrides[p] && <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />}
            </button>
          ))}
        </div>

        {previewPlatform ? (
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl sticky top-24 transition-all duration-300 transform-gpu hover:shadow-indigo-500/10">
            <div className="bg-slate-50 dark:bg-slate-800/30 px-4 py-2 border-b dark:border-slate-800 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  {PLATFORM_CONFIGS[previewPlatform].icon}
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{previewPlatform} RENDER</span>
               </div>
               {isIndividualTuning && overrides[previewPlatform] && (
                 <span className="text-[10px] font-bold text-indigo-500 flex items-center gap-1">
                   <ShieldCheck className="w-3 h-3" /> OVERRIDE ACTIVE
                 </span>
               )}
            </div>
            {renderPlatformSpecificPreview(previewPlatform)}
          </div>
        ) : (
          <div className="h-[400px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800">
            <PenSquare className="w-12 h-12 mb-4 opacity-10" />
            <p className="text-sm font-medium">Select platforms above to view individual preview renders.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostComposer;
