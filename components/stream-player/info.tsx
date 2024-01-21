import {TiPencil} from "react-icons/ti";
import {Button} from "@/components/ui/button";
import {StreamModel} from "@/api";
import Image from "next/image";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import {useState, useTransition} from "react";
import {updateStreamAction} from "@/actions/stream";
import {toast} from "sonner";

export type PlayerStreamModel = Omit<StreamModel, 'serverUrl' | 'streamKey'> & {
  serverUrl: null;
  streamKey: null;
};

interface StreamInfoProps {
  streamModel: PlayerStreamModel;
  className?: string;
}

export default function StreamInfo({streamModel, className}: StreamInfoProps) {
  return (
    <div className={cn("m-4 rounded-xl w-full border", className)}>
      <div className={"p-4 flex space-x-4 items-center border-b"}>
        <div className={"p-2 w-fit rounded bg-blue-600 flex-none"}>
          <TiPencil className={"w-6 h-6 text-white"}/>
        </div>
        <div className={"flex-auto"}>
          <h2 className={"font-semibold text-lg"}>Edit Your Stream Info</h2>
          <p className={"text-muted-foreground"}>Maximize your visibility</p>
        </div>
        <StreamInfoEditModal streamModel={streamModel}/>
      </div>
      <div className={"p-4 space-y-4"}>
        <div className={"space-y-2"}>
          <h3 className={"text-muted-foreground"}>Name</h3>
          <p className={"font-semibold"}>{streamModel.name}</p>
        </div>
        <div className={"space-y-2"}>
          <h3 className={"text-muted-foreground"}>Thumbnail</h3>
          <div className="relative aspect-video rounded-md overflow-hidden w-[320px] border border-white/10">
            <Image
              fill
              src={streamModel.thumbnailPath ?? ""}
              alt={streamModel.name}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StreamInfoEditModal({streamModel}: { streamModel: PlayerStreamModel }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    startTransition(() => {
      updateStreamAction(formData)
        .then(() => toast.success("Updated successfully!"))
        .catch(e => toast.error(e.message))
        .finally(() => setOpen(false))
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>Edit</Button>
      </DialogTrigger>
      <DialogContent className="w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Stream Info</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-end">
                Name
              </Label>
              <Input disabled={isPending} id="name" name={"name"} className="col-span-3"
                     defaultValue={streamModel.name}/>
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isPending} type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}