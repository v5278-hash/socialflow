
export enum SocialPlatform {
  LINKEDIN = 'LinkedIn',
  TWITTER = 'Twitter',
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  TIKTOK = 'TikTok',
  YOUTUBE = 'YouTube',
  PINTEREST = 'Pinterest'
}

export type PlatformStatus = 'Draft' | 'Scheduled' | 'Published' | 'Failed';

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  uploadProgress?: number; // 0-100
}

export interface PostOverride {
  content: string;
  media: MediaItem[];
}

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  avatar: string;
  isConnected: boolean;
  type: 'Personal' | 'Business';
  followers: number;
  lastSync?: Date;
}

export interface Post {
  id: string;
  content: string;
  media: MediaItem[];
  platforms: SocialPlatform[];
  status: PlatformStatus;
  platformStatuses: Record<string, PlatformStatus>;
  overrides?: Record<string, PostOverride>;
  scheduledAt?: Date;
  publishedAt?: Date;
  metrics?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface APIResearch {
  platform: SocialPlatform;
  isFree: boolean;
  limitations: string;
  workarounds: string;
  recommendation: string;
}
