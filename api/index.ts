export const PATH_PREFIX = process.env.PATH_PREFIX ?? "";

export const LOGIN_API_URL = `${PATH_PREFIX}/api/auth/login`

export const LOGOUT_API_URL = `${PATH_PREFIX}/api/auth/logout`

export const getAvatarApiUrl = (userId: string) => `/api/user/avatar?user=${userId}`
export const getStreamApiUrl = (username: string, protocol: string) => `/api/connection/stream/${username}?protocol=${protocol}`
export const getStreamThumbnailApiUrl = (userId: string) => `/api/stream/thumbnail?user=` + userId;

export interface UserProfileModel {
  id: string;
  username: string;
  email: string;
}

export interface StreamModel {
  id: string;

  serverUrl: string;
  streamKey: string;

  live: boolean;
  name: string;

  thumbnailContentType?: string;
  thumbnailPath?: string;
}