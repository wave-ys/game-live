import {getStreamApi} from "@/api/stream";
import CardSwitch from "@/app/(creator)/u/[username]/chat/_components/card-switch";

export default async function ChatPage() {
  const stream = await getStreamApi();
  if (stream == null)
    return <>Error: Stream not found</>;

  return (
    <div className={"p-6"}>
      <h1 className={"font-semibold text-2xl"}>Chat</h1>
      <div className={"mt-8 space-y-6"}>
        <CardSwitch label={"Enable chat"} value={stream.chatEnabled} name={'chatEnabled'}/>
        <CardSwitch label={"Must be following to chat"} value={stream.chatFollowersOnly} name={'chatFollowersOnly'}/>
      </div>
    </div>
  )
}