import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

export interface SidebarItemProps {
  icon: React.ReactNode
  label: string;
  href: string;
}

export default function SidebarItem({icon, label, href}: SidebarItemProps) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link href={href} className={cn(
      "flex items-center p-2 rounded",
      !active && "hover:bg-accent hover:text-accent-foreground",
      active && "bg-primary text-primary-foreground")
    }>
      <span>{icon}</span>
      <span className={"text-sm ms-2"}>{label}</span>
    </Link>
  )
}