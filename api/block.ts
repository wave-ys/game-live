import {PATH_PREFIX} from "@/api/index";
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