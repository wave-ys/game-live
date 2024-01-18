'use client';

import SidebarHeader from "@/app/(creator)/u/[username]/_components/sidebar/header";
import {cn} from "@/lib/utils";
import {useCreatorSidebar} from "@/store/use-creator-sidebar";

interface CreatorSidebarProps {
  className?: string;
}

export default function CreatorSidebar({className}: CreatorSidebarProps) {
  const collapsed = useCreatorSidebar(state => state.collapsed);

  return (
    <aside className={cn("w-64 p-2 h-full border-e", collapsed && "w-14", className)}>
      <SidebarHeader/>
    </aside>
  )
}