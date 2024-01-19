import UrlCard from "@/app/(creator)/u/[username]/keys/_components/url-card";
import GenerateButton from "@/app/(creator)/u/[username]/keys/_components/generate-button";
import {getStreamApi} from "@/api/stream";
import KeyCard from "@/app/(creator)/u/[username]/keys/_components/key-card";

export default async function KeysPage() {
  const stream = await getStreamApi();
  if (stream == null)
    return <>Error: Stream not found</>;

  return (
    <div className={"p-6"}>
      <div className={"flex items-center justify-between"}>
        <h1 className={"font-semibold text-2xl"}>Keys & URLs</h1>
        <GenerateButton/>
      </div>
      <div className={"mt-8 space-y-6"}>
        <UrlCard value={stream.serverUrl}/>
        <KeyCard value={stream.streamKey}/>
      </div>
    </div>
  );
}