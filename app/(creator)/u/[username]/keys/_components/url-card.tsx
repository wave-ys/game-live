import {Input} from "@/components/ui/input";
import CopyButton from "@/app/(creator)/u/[username]/keys/_components/copy-button";

interface KeyCardProps {
  value: string;
}

export default function UrlCard({value}: KeyCardProps) {
  return (
    <div className={"flex items-center space-x-2 border p-4 rounded-lg"}>
      <span className={"font-semibold flex-none w-36 text-lg"}>Stream Key</span>
      <Input value={value ?? ""} disabled className={"flex-auto"}/>
      <CopyButton className={"flex-none"} value={value}/>
    </div>
  )
}