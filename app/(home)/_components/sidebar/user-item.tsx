import {getAvatarApiUrl, SidebarItemModel} from "@/api";
import React from "react";
import {useHomeSidebar} from "@/store/use-home-sidebar";
import {usePathname} from "next/navigation";
import Link from "next/link";
import UserAvatar from "@/components/user-avatar";
import {cn} from "@/lib/utils";
import LiveBadge from "@/components/live-badge";

interface UserItemProps {
  item: SidebarItemModel;
}

export default function UserItem({item}: UserItemProps) {
  const collapsed = useHomeSidebar(state => state.collapsed);
  const pathname = usePathname();

  const href = `/${item.username}`;
  const isActive = pathname.startsWith(href);

  return (
    <Link href={href}
          className={cn("flex items-center w-full hover:bg-secondary py-1.5", collapsed ? "px-2" : "px-3.5", isActive && "bg-accent")}>
      <UserAvatar
        hideBadge={true}
        src={getAvatarApiUrl(item.id)}
        className={cn("flex-none", item.isLive && "ring-2 ring-offset-background ring-offset-2 ring-rose-500")}
        isLive={item.isLive}
        alt={item.username}/>
      {!collapsed && (
        <p className={"truncate text-sm ms-3 font-semibold"}>
          {item.username}
        </p>
      )}
      {!collapsed && item.isLive && <LiveBadge className={"ms-auto"}/>}
    </Link>
  )
}