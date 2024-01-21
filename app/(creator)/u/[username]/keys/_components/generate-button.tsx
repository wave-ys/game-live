'use client';

import {Button} from "@/components/ui/button";
import {useTransition} from "react";
import {generateConnectionAction} from "@/actions/connection";
import {toast} from "sonner";

export default function GenerateButton() {
  const [isPending, startTransition] = useTransition();
  const handleClick = () => {
    startTransition(() => {
      generateConnectionAction()
        .then(() => toast.success("Generated successfully"))
        .catch(e => toast.error(e.message))
    });
  }

  return <Button type={"button"} onClick={handleClick} disabled={isPending}>Generate Connection</Button>;
}