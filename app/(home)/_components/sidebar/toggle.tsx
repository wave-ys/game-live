'use client';

import {Button} from "@/components/ui/button";
import React, {useRef} from "react";
import {useHomeSidebar} from "@/store/use-home-sidebar";
import {RiExpandLeftLine, RiExpandRightLine} from "react-icons/ri";
import {cn} from "@/lib/utils";
import Hint from "@/components/hint";


interface ToggleProps {
  className?: string;
}

export default function SidebarToggle({className}: ToggleProps) {
  const {collapsed, collapse, expand} = useHomeSidebar();
  const ref = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    if (collapsed)
      expand();
    else
      collapse();
    ref.current?.blur();
  }

  return (
    <span className={"flex justify-between mb-3.5"}>
      {!collapsed && <h1 className={"font-bold text-lg ms-3.5"}>For You</h1>}
      <Hint text={collapsed ? "Expand" : "Collapse"}>
        <Button ref={ref} onClick={handleToggle} size={"icon"} variant={"ghost"}
                className={cn("h-8 w-8 mx-2", className)}>
          {
            collapsed ?
              <RiExpandRightLine className={"w-5 h-5"}/> :
              <RiExpandLeftLine className={"w-5 h-5"}/>
          }
        </Button>
      </Hint>
    </span>
  )
}