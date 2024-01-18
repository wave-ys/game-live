'use client';

import {Input} from "@/components/ui/input";
import CopyButton from "@/app/(creator)/u/[username]/keys/_components/copy-button";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {LuEye, LuEyeOff} from "react-icons/lu";

interface UrlCardProps {
  value: string | null;
}

export default function UrlCard({value}: UrlCardProps) {
  const [hidden, setHidden] = useState(true);

  return (
    <div className={"flex items-center space-x-2 border p-4 rounded-lg"}>
      <span className={"font-semibold flex-none w-36 text-lg"}>Server URL</span>

      <Input type={hidden ? "password" : "text"} disabled className={"flex-auto"}/>

      <Button onClick={() => setHidden(!hidden)}
              className={"flex-none"}
              disabled={!value}
              size={"icon"}
              variant={"ghost"}>
        {hidden ? <LuEye className={"w-4 h-4"}/> : <LuEyeOff className={"w-4 h-4"}/>}
      </Button>

      <CopyButton className={"flex-none"} value={value ?? ""}/>
    </div>
  )
}