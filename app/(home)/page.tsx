import {getAvatarApiUrl, getStreamThumbnailApiUrl, SidebarItemModel} from "@/api";
import getRecommendedApi from "@/api/recommended";
import Link from "next/link";
import UserAvatar from "@/components/user-avatar";

function Card({item}: { item: SidebarItemModel }) {
  return (
    <Link href={`/${item.username}`}>
      <div className={"flex flex-col h-[240px] w-fit rounded-md border shadow"}>
        <div className="flex-none aspect-video rounded-md overflow-hidden w-[320px] border border-white/10">
          <img
            width={320}
            height={180}
            loading={'eager'}
            src={getStreamThumbnailApiUrl(item.id)}
            alt={item.username}
            className="object-cover"
          />
        </div>
        <div className={"flex flex-auto items-center p-2 space-x-2"}>
          <UserAvatar alt={item.username} src={getAvatarApiUrl(item.id)} isLive={item.isLive}/>
          <div>
            <div className={"font-semibold truncate"}>{item.streamName}</div>
            <div className={"text-xs text-muted-foreground truncate"}>{item.username}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default async function Page() {
  const recommended = await getRecommendedApi();

  return (
    <div className="h-full p-8 max-w-screen-2xl mx-auto grid grid-cols-4 gap-12">
      {recommended.map(item => <Card key={item.id} item={item}/>)}
    </div>
  );
};