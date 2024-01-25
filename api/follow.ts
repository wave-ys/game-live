import {PATH_PREFIX, SidebarItemModel} from "@/api/index";
import {cookies} from "next/headers";

export async function checkFollowStatusApi(otherId: string) {
  const response = await fetch(`${PATH_PREFIX}/api/follow/is-following/${otherId}`, {
    headers: {
      ["Cookie"]: cookies().toString()
    }
  });
  if (!response.ok)
    return false;
  const text = await response.text();
  return text === 'true';
}

export async function getFollowingUsersApi() {
  const response = await fetch(`${PATH_PREFIX}/api/follow`, {
    headers: {
      ["Cookie"]: cookies().toString()
    }
  });
  if (!response.ok)
    return [];
  return await response.json() as SidebarItemModel[];
}