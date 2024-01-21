'use server';

import {PATH_PREFIX} from "@/api";
import {cookies} from "next/headers";
import {revalidatePath} from "next/cache";
import {getUserProfileApi} from "@/api/auth";

export async function generateConnectionAction() {
  const self = await getUserProfileApi();
  if (self == null)
    throw new Error("Please login.")

  const response = await fetch(`${PATH_PREFIX}/api/connection/generate`, {
    method: 'post',
    headers: {
      ["Cookie"]: cookies().toString()
    }
  });
  if (!response.ok)
    throw new Error("Some errors occurred. Please try again later.");
  revalidatePath(`/u/${self.username}/keys`);
}