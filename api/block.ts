import {BlockedUserModel, PATH_PREFIX} from "@/api/index";
import {cookies} from "next/headers";

export async function isBlockedByApi(otherId: string) {
  const response = await fetch(`${PATH_PREFIX}/api/block/is-blocked-by/${otherId}`, {
    headers: {
      ["Cookie"]: cookies().toString()
    }
  });
  if (!response.ok)
    return false;
  const text = await response.text();
  return text === 'true';
}

export async function getBlockedUsers() {
  const response = await fetch(`${PATH_PREFIX}/api/block/users`, {
    headers: {
      ["Cookie"]: cookies().toString()
    }
  });
  if (response.status === 401)
    throw new Error("Please login again.")
  if (!response.ok)
    throw new Error("Some errors occurred. Please try again.");
  return await response.json() as BlockedUserModel[];
}