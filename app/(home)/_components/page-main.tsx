'use client';

import {useHomeSidebar} from "@/store/use-home-sidebar";
import {cn} from "@/lib/utils";
import React from "react";

export default function PageMain({children}: { children?: React.ReactNode }) {
  const collapsed = useHomeSidebar(state => state.collapsed)

  return (
    <div className={cn(collapsed ? "ml-12" : "ml-64")}>
      {children}
    </div>
  )
}