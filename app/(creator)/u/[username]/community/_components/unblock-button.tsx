'use client';

import {Button} from "@/components/ui/button";
import {useTransition} from "react";
import {toggleBlockAction} from "@/actions/block";
import {toast} from "sonner";

export default function UnblockButton({userId}: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  const handleUnblock = () => {
    startTransition(() => {
      toggleBlockAction(userId, false).then().catch(e => toast.error(e.message));
    })
  }

  return (
    <Button disabled={isPending} onClick={handleUnblock} variant={"link"}>Unblock</Button>
  )
}