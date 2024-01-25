import UserAvatar from "@/components/user-avatar";
import {getAvatarApiUrl, UserProfileModel} from "@/api";
import {PlayerStreamModel} from "@/components/stream-player/info-editor";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {FaHeart} from "react-icons/fa";
import {useEventHub} from "@/components/event-hub";
import {useEffect, useMemo, useState, useTransition} from "react";
import {LiveStatus} from "@/components/stream-player/index";
import {LuUser} from "react-icons/lu";
import {toggleFollowAction} from "@/actions/follow";
import {toast} from "sonner";

interface StreamInfoProps {
  className?: string;
  userProfileModel: UserProfileModel;
  streamModel: PlayerStreamModel;
  isSelf: boolean;
  liveStatus: LiveStatus;
  isFollower: boolean;
}

export default function StreamInfo({
                                     className,
                                     userProfileModel,
                                     streamModel,
                                     isSelf,
                                     liveStatus,
                                     isFollower
                                   }: StreamInfoProps) {
  const {connected, subscribeStreamViewer, unsubscribeStreamViewer} = useEventHub();
  const [viewer, setViewer] = useState(0);

  const [isFollowPending, startFollowTransition] = useTransition();

  const handleToggleFollow = () => {
    startFollowTransition(() => {
      toggleFollowAction(userProfileModel.id, !isFollower).catch(e => toast.error(e.message));
    })
  }

  useEffect(() => {
    if (!connected)
      return;
    const subscriber = (userId: string, viewer: number) => setViewer(viewer);
    subscribeStreamViewer(userProfileModel.id, subscriber).then();
    return () => {
      unsubscribeStreamViewer(userProfileModel.id, subscriber).then();
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
                  alt={'avatar'} isLive={liveStatus === 'on'}/>
      <div className={"flex-auto space-y-0.5"}>
        <h2 className={"font-semibold text-lg"}>{userProfileModel.username}</h2>
        <p>{streamModel.name}</p>
        <p className={"text-muted-foreground text-sm"}>{viewerDisplay}</p>
      </div>
      {
        !isSelf && (
          <Button disabled={isFollowPending} variant={isFollower ? "secondary" : "primary-blue"}
                  onClick={handleToggleFollow}>
            <FaHeart className={"w-4 h-4 mr-2"}/>
            {isFollower ? "Unfollow" : "Follow"}
          </Button>
        )
      }
    </div>
  )
}