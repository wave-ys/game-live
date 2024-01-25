'use server';

import {PATH_PREFIX} from "@/api";
import {revalidatePath} from "next/cache";
import {cookies} from "next/headers";
import {getUserProfileApi} from "@/api/auth";

export async function toggleBlockAction(otherId: string, status: boolean) {
  const user = await getUserProfileApi();
  if (user === null)
    throw new Error("Please login again");
  const response = await fetch(`${PATH_PREFIX}/api/block/toggle?other=${otherId}&status=${status}`, {
    method: "post",
    headers: {
      ["Cookie"]: cookies().toString()
    }
  });
  if (response.status === 401)
    throw new Error("Please login again.")
  if (!response.ok)
    throw new Error("Some errors occurred. Please try again.");
  revalidatePath('/');
}