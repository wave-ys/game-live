import {PATH_PREFIX, UserProfileModel} from "@/api/index";
import {cookies} from "next/headers";

export async function getUserProfileApi() {
  const response = await fetch(`${PATH_PREFIX}/api/auth/profile`, {
    headers: {
      ["Cookie"]: cookies().toString()
    }
  });

  if (!response.ok)
    return null;
  return await response.json() as UserProfileModel;
}