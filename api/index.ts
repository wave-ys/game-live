export const PATH_PREFIX = process.env.PATH_PREFIX

export const LOGIN_API_URL = `${PATH_PREFIX}/api/auth/login`

export const LOGOUT_API_URL = `${PATH_PREFIX}/api/auth/logout`

export const getAvatarApiUrl = (userId: string) => `${PATH_PREFIX}/api/user/avatar?user=${userId}`

export interface UserProfileModel {
  id: string;
  username: string;
  email: string;
}