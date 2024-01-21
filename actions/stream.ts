'use server';

import {PATH_PREFIX} from "@/api";
import {cookies} from "next/headers";
import {revalidatePath} from "next/cache";
import {getUserProfileApi} from "@/api/auth";

export async function updateStreamAction(stream: FormData) {
  const self = await getUserProfileApi();
  if (self === null)
    throw new Error("Please login again.")

  const response = await fetch(`${PATH_PREFIX}/api/stream/`, {
    method: 'put',
    headers: {
      ['Cookie']: cookies().toString()
    },
    body: stream
  });
  if (!response.ok)
    throw new Error("Some errors occurred. Please try again later.");

  revalidatePath(`/u/${self.username}/chat`);
  revalidatePath(`/u/${self.username}`);
  revalidatePath(`/${self.username}`);
}