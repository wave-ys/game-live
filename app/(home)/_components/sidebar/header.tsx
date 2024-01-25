import {useHomeSidebar} from "@/store/use-home-sidebar";
import Hint from "@/components/hint";
import React from "react";

export default function SidebarHeader({title, icon}: { title: string, icon: React.ReactNode }) {
  const collapsed = useHomeSidebar((state) => state.collapsed)
  if (!collapsed)
    return (
      <h2 className={"uppercase text-sm font-semibold mx-3.5"}>
        {title}
      </h2>
    );
  return (
    <Hint text={title}>
      <span className={"inline-flex justify-center w-full"}>
        {icon}
      </span>
    </Hint>
  )
}