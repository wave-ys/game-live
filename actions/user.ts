'use server';

import {PATH_PREFIX} from "@/api";
import {cookies} from "next/headers";
import {revalidatePath} from "next/cache";

export async function updateUserAvatarAction(formData: FormData) {
  const response = await fetch(`${PATH_PREFIX}/api/user/avatar`, {
    method: 'put',
    headers: {
      ['Cookie']: cookies().toString()
    },
    body: formData
  });
  if (!response.ok)
    throw new Error("Some errors occurred. Please try again later.");

  revalidatePath('/');
}