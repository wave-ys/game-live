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