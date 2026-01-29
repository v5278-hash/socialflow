
import React from 'react';
import { 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube, 
  MessageCircle, 
  Camera, 
  Share2,
  Video
} from 'lucide-react';
import { SocialPlatform, APIResearch } from './types';

export const PLATFORM_CONFIGS = {
  [SocialPlatform.LINKEDIN]: {
    icon: <Linkedin className="w-5 h-5 text-[#0077b5]" />,
    color: '#0077b5',
    maxChars: 3000,
    mediaTypes: ['image', 'video'],
  },
  [SocialPlatform.TWITTER]: {
    icon: <Twitter className="w-5 h-5 text-[#1DA1F2]" />,
    color: '#1DA1F2',
    maxChars: 280,
    mediaTypes: ['image', 'video', 'gif'],
  },
  [SocialPlatform.FACEBOOK]: {
    icon: <Facebook className="w-5 h-5 text-[#1877F2]" />,
    color: '#1877F2',
    maxChars: 63206,
    mediaTypes: ['image', 'video'],
  },
  [SocialPlatform.INSTAGRAM]: {
    icon: <Instagram className="w-5 h-5 text-[#E4405F]" />,
    color: '#E4405F',
    maxChars: 2200,
    mediaTypes: ['image', 'video'],
  },
  [SocialPlatform.TIKTOK]: {
    icon: <Share2 className="w-5 h-5 text-[#000000]" />,
    color: '#000000',
    maxChars: 2200,
    mediaTypes: ['video'],
  },
  [SocialPlatform.YOUTUBE]: {
    icon: <Youtube className="w-5 h-5 text-[#FF0000]" />,
    color: '#FF0000',
    maxChars: 5000,
    mediaTypes: ['video'],
  },
  [SocialPlatform.PINTEREST]: {
    icon: <Share2 className="w-5 h-5 text-[#BD081C]" />,
    color: '#BD081C',
    maxChars: 500,
    mediaTypes: ['image'],
  },
};

export const API_RESEARCH_DATA: APIResearch[] = [
  {
    platform: SocialPlatform.LINKEDIN,
    isFree: true,
    limitations: "API access requires 'Marketing Developer Platform' approval. Free tier supports posting to members and pages via UGC API.",
    workarounds: "Puppeteer automation exists but is high-risk. RSS-to-LinkedIn via Zapier/IFTTT (Free limited).",
    recommendation: "Use official API for stability. Ensure 'w_member_social' scope is requested."
  },
  {
    platform: SocialPlatform.TWITTER,
    isFree: false,
    limitations: "Free tier v2 API only allows 1,500 tweets/month (app-level). Writing access requires 'Basic' tier ($100/mo).",
    workarounds: "Third-party aggregators like RapidAPI might offer cheaper per-call rates. Selenium automation is highly detected.",
    recommendation: "Requires budget. For MVP, focus on Free tiers of other platforms first."
  },
  {
    platform: SocialPlatform.FACEBOOK,
    isFree: true,
    limitations: "Requires App Review for 'pages_manage_posts'. Graph API is robust but strict on tokens.",
    workarounds: "Meta Business Suite is the best manual alternative. APIs are stable for Business Pages.",
    recommendation: "Focus on Page posting. Profile posting is heavily restricted for apps."
  },
  {
    platform: SocialPlatform.INSTAGRAM,
    isFree: true,
    limitations: "Content Publishing API limited to Professional accounts (Business/Creator) connected to FB Pages.",
    workarounds: "Can be posted via Facebook Graph API for connected accounts. No direct personal profile API.",
    recommendation: "Must require users to switch to Business/Creator accounts."
  }
];
