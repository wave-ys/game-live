export const PATH_PREFIX = process.env.PATH_PREFIX ?? "";

export const LOGIN_API_URL = `${PATH_PREFIX}/api/auth/login`

export const LOGOUT_API_URL = `${PATH_PREFIX}/api/auth/logout`

export const getMyAvatarApiUrl = (timestamp: number) => `/api/user/avatar/me?timestamp=${timestamp}`;

export const getAvatarApiUrl = (userId: string) => `/api/user/avatar?user=${userId}`
export const getStreamApiUrl = (username: string, protocol: string) => `/api/connection/stream/${username}?protocol=${protocol}`
export const getStreamThumbnailApiUrl = (userId: string) => `/api/stream/thumbnail?user=` + userId;

export interface UserProfileModel {
  id: string;
  username: string;
  email: string;
}

export interface SidebarItemModel {
  id: string;
  username: string;
  isLive: boolean;
}

export interface BlockedUserModel {
  id: string;
  username: string;
  createdAt: string;
}

export interface StreamModel {
  id: string;

  serverUrl: string;
  streamKey: string;

  live: boolean;
  name: string;

  thumbnailContentType?: string;
  thumbnailPath?: string;

  chatEnabled: boolean;
  chatFollowersOnly: boolean;
}