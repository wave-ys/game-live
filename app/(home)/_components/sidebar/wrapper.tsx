'use client';

import React from "react";
import {useHomeSidebar} from "@/store/use-home-sidebar";
import {cn} from "@/lib/utils";

interface WrapperProps {
  children: React.ReactNode,
  className?: string;
}

export default function SidebarWrapper({className, children}: WrapperProps) {
  const collapsed = useHomeSidebar((state) => state.collapsed)

  return (
    <aside
      className={cn(
        "fixed left-0 flex flex-col w-64 h-full bg-background border-r z-30 py-2",
        collapsed && "w-12",
        className
      )}>
      {children}
    </aside>
  )
}