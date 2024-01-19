import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import {useCreatorSidebar} from "@/store/use-creator-sidebar";

export interface SidebarItemProps {
  icon: React.ReactNode
  label: string;
  href: string;
}

export default function SidebarItem({icon, label, href}: SidebarItemProps) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);
  const collapsed = useCreatorSidebar(state => state.collapsed);

  return (
    <Link href={href} className={cn(
      "flex items-center p-2 rounded",
      !active && "hover:bg-accent hover:text-accent-foreground",
      active && "bg-primary text-primary-foreground",
      collapsed && "justify-center w-fit p-3",
      !collapsed && "w-full")
    }>
      <span>{icon}</span>
      {!collapsed && <span className={"text-sm ms-2"}>{label}</span>}
    </Link>
  )
}