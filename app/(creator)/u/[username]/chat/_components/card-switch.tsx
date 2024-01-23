'use client';

import {Switch} from "@/components/ui/switch";
import {useTransition} from "react";
import {updateStreamAction} from "@/actions/stream";
import {toast} from "sonner";

interface CardSwitchProps {
  label: string;
  value: boolean;
  name: string;
}

export default function CardSwitch({label, value, name}: CardSwitchProps) {
  const [isPending, startTransition] = useTransition();
  const handleChange = (checked: boolean) => {
    startTransition(() => {
      const formData = new FormData();
      formData.set(name, checked + "");
      updateStreamAction(formData)
        .then(() => toast.success("Updated successfully!"))
        .catch(e => toast.error(e.message));
    })
  }

  return (
    <div className={"p-6 flex border rounded-xl"}>
      <span className={"flex-auto font-semibold"}>{label}</span>
      <span className={"flex-none"}><Switch checked={value} disabled={isPending} onCheckedChange={handleChange}/></span>
    </div>
  )
}