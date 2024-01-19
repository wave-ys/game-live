'use client';

import SidebarHeader from "@/app/(creator)/u/[username]/_components/sidebar/header";
import {cn} from "@/lib/utils";
import {useCreatorSidebar} from "@/store/use-creator-sidebar";
import SidebarItem from "@/app/(creator)/u/[username]/_components/sidebar/item";
import {CiStreamOn} from "react-icons/ci";
import {UserProfileModel} from "@/api";
import {VscKey} from "react-icons/vsc";
import {IoChatboxEllipsesOutline, IoPeopleOutline} from "react-icons/io5";

interface CreatorSidebarProps {
  className?: string;
  userProfile: UserProfileModel;
}

export default function CreatorSidebar({className, userProfile}: CreatorSidebarProps) {
  const collapsed = useCreatorSidebar(state => state.collapsed);
  const iconClassName = collapsed ? "h-5 w-5" : "h-4 w-4";

  return (
    <aside className={cn("w-64 p-2 h-full border-e bg-background", collapsed && "w-14", className)}>
      <SidebarHeader/>
      <div className={cn("mt-2 flex flex-col items-center", !collapsed ? "space-y-1" : "space-y-2")}>
        <SidebarItem icon={<CiStreamOn className={iconClassName}/>} label={"Stream"}
                     href={`/u/${userProfile.username}/stream`}/>
        <SidebarItem icon={<VscKey className={iconClassName}/>} label={"Keys"}
                     href={`/u/${userProfile.username}/keys`}/>
        <SidebarItem icon={<IoChatboxEllipsesOutline className={iconClassName}/>} label={"Chat"}
                     href={`/u/${userProfile.username}/chat`}/>
        <SidebarItem icon={<IoPeopleOutline className={iconClassName}/>} label={"Community"}
                     href={`/u/${userProfile.username}/community`}/>
      </div>
    </aside>
  )
}