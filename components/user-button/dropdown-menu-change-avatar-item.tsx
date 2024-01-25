'use client';

import {TbArrowsExchange2} from "react-icons/tb";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState, useTransition} from "react";
import {updateUserAvatarAction} from "@/actions/user";
import {toast} from "sonner";
import {useMyAvatar} from "@/store/use-my-avatar";


export default function DropdownMenuChangeAvatarItem() {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false);
  const refreshAvatar = useMyAvatar(state => state.refresh);

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      updateUserAvatarAction(formData)
        .then(() => {
          toast.success("Updated successfully!");
          setOpen(false);
          refreshAvatar();
        })
        .catch(e => toast.error(e.message));
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <TbArrowsExchange2 className={"h-4 w-4 me-2"}/>
          Change Avatar
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Avatar</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className={"space-y-4"}>
          <Input type={"file"} disabled={isPending} name={"avatar"}/>
          <DialogFooter>
            <Button disabled={isPending} type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}