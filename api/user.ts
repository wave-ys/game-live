import {PATH_PREFIX} from "@/api/index";
import {UserProfileModel} from "@/api";

export async function getUserByIdApi(id: string) {
  const response = await fetch(`${PATH_PREFIX}/api/user/${id}`, {
    cache: 'no-store'
  });
  if (!response.ok)
    return null;
  return await response.json() as UserProfileModel;
}

export async function getUserByUsername(username: string) {
  const response = await fetch(`${PATH_PREFIX}/api/user/username/${username}`, {
    cache: 'no-store'
  });
  if (!response.ok)
    return null;
  return await response.json() as UserProfileModel;
}