import StreamPlayer from "@/components/stream-player";
import {getUserProfileApi} from "@/api/auth";
import {getStreamApi} from "@/api/stream";

export default async function StreamPage() {
  const self = await getUserProfileApi();
  const stream = await getStreamApi();
  if (self === null || stream === null)
    return <>Error: User or stream not found</>

  return (
    <div className={"h-[calc(100vh-3.5rem)]"}>
      <StreamPlayer isSelf={true} userProfileModel={self}
                    streamModel={{...stream, serverUrl: null, streamKey: null, thumbnailPath: null}}/>
    </div>
  )
}