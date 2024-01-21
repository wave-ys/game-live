import UserAvatar from "@/components/user-avatar";
import {getAvatarApiUrl, UserProfileModel} from "@/api";
import {PlayerStreamModel} from "@/components/stream-player/info-editor";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {FaHeart} from "react-icons/fa";
import {useEventHub} from "@/components/event-hub";
import {useEffect, useMemo, useState} from "react";
import {LiveStatus} from "@/components/stream-player/index";
import {LuUser} from "react-icons/lu";

interface StreamInfoProps {
  className?: string;
  userProfileModel: UserProfileModel;
  streamModel: PlayerStreamModel;
  isSelf: boolean;
  liveStatus: LiveStatus
}

export default function StreamInfo({className, userProfileModel, streamModel, isSelf, liveStatus}: StreamInfoProps) {
  const {connected, subscribeStreamViewer, unsubscribeStreamViewer} = useEventHub();
  const [viewer, setViewer] = useState(0);

  useEffect(() => {
    if (!connected)
      return;
    const subscriber = (userId: string, viewer: number) => setViewer(viewer);
    const cleanUp = () => unsubscribeStreamViewer(userProfileModel.id, subscriber).then();
    subscribeStreamViewer(userProfileModel.id, subscriber).then();

    window.addEventListener('beforeunload', cleanUp);
    return () => {
      cleanUp().then();
      window.removeEventListener('beforeunload', cleanUp);
    }
  }, [connected, subscribeStreamViewer, unsubscribeStreamViewer, userProfileModel.id]);

  const viewerDisplay = useMemo(() => {
    if (liveStatus === 'loading')
      return 'Loading...';
    return liveStatus === 'on' ? (
      <span className={"inline-flex items-center"}>
        <LuUser className={"mr-1"}/> {viewer} viewers
      </span>
    ) : 'Offline';
  }, [liveStatus, viewer])

  return (
    <div className={cn("flex space-x-4 items-center", className)}>
      <UserAvatar className={"h-16 w-16 flex-none"}
                  fallBackClassName={"h-6 w-6"}
                  src={getAvatarApiUrl(userProfileModel.id)}
                  alt={'avatar'}/>
      <div className={"flex-auto space-y-0.5"}>
        <h2 className={"font-semibold text-lg"}>{userProfileModel.username}</h2>
        <p>{streamModel.name}</p>
        <p className={"text-muted-foreground text-sm"}>{viewerDisplay}</p>
      </div>
      {
        !isSelf && (
          <Button variant={"primary-blue"}>
            <FaHeart className={"w-4 h-4 mr-2"}/>
            Follow
          </Button>
        )
      }
    </div>
  )
}