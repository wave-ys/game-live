import {PATH_PREFIX, StreamModel} from "@/api/index";
import {cookies} from "next/headers";

export async function getStreamApi() {
  const response = await fetch(`${PATH_PREFIX}/api/stream`, {
    headers: {
      ["Cookie"]: cookies().toString()
    }
  });

  if (!response.ok)
    return null;
  return await response.json() as StreamModel;
}

export async function getStreamByUserIdApi(userId: string) {
  const response = await fetch(`${PATH_PREFIX}/api/stream/${userId}`, {
    cache: 'no-store'
  });

  if (!response.ok)
    return null;
  return await response.json() as StreamModel;
}