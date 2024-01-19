'use client';

import React from "react";
import {useCreatorSidebar} from "@/store/use-creator-sidebar";
import {cn} from "@/lib/utils";

export default function CreatorMainWrapper({children}: { children: React.ReactNode }) {
  const collapsed = useCreatorSidebar(state => state.collapsed);

  return (
    <div className={cn(!collapsed ? "ms-64" : "ms-14")}>
      {children}
    </div>
  )
}