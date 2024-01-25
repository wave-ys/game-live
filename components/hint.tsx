import React from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

interface HintProps {
  children: React.ReactNode,
  text?: string,
  side?: "top" | "right" | "bottom" | "left"
}

export default function Hint({children, text, side}: HintProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side ?? "right"}>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}