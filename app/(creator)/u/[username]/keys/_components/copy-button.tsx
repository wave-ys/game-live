'use client';

import {Button} from "@/components/ui/button";
import {useState} from "react";
import {LuCopy, LuCopyCheck} from "react-icons/lu";

export default function CopyButton({value, className}: { value: string, className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 700);
  }

  return (
    <Button disabled={!value} onClick={handleClick} className={className} size={"icon"} variant={"ghost"}>
      {copied ? <LuCopyCheck className={"w-4 h-4"}/> : <LuCopy className={"w-4 h-4"}/>}
    </Button>
  )
}