import {PATH_PREFIX, SidebarItemModel} from "@/api/index";
import {cookies} from "next/headers";

export default async function getRecommendedApi() {
  const res = await fetch(`${PATH_PREFIX}/api/recommended`, {
    headers: {
      ["Cookie"]: cookies().toString()
    }
  });
  return await res.json() as SidebarItemModel[];
}