import StreamPlayer from "@/components/stream-player";
import {getUserProfileApi} from "@/api/auth";
import {redirect} from "next/navigation";

export default async function StreamPage() {
  const self = await getUserProfileApi();
  if (self == null)
    redirect("/");

  return (
    <div className={"h-[calc(100vh-3.5rem)]"}>
      <StreamPlayer userProfileModel={self}/>
    </div>
  )
}