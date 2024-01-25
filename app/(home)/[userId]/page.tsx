import {getUserByIdApi} from "@/api/user";
import {getStreamByUserIdApi} from "@/api/stream";
import StreamPlayer from "@/components/stream-player";
import {isFollowingApi} from "@/api/follow";
import {getUserProfileApi} from "@/api/auth";
import {redirect} from "next/navigation";


interface UserPageProps {
  params: {
    userId: string
  }
}

export default async function UserPage({params}: UserPageProps) {
  const self = await getUserProfileApi();
  const user = await getUserByIdApi(params.userId);
  const stream = await getStreamByUserIdApi(params.userId);
  if (user === null || stream === null)
    return <>Error: User or stream not found</>
  if (self?.id === user.id)
    redirect(`/u/${params.userId}/stream`);

  const isFollower = await isFollowingApi(params.userId);

  return (
    <div className={"h-[calc(100vh-3.5rem)]"}>
      <StreamPlayer isSelf={!!self && self.id === user.id} userProfileModel={user} isFollower={isFollower}
                    hasAuthenticated={!!self}
                    streamModel={{...stream, serverUrl: null, streamKey: null, thumbnailPath: null}}/>
    </div>
  )
}