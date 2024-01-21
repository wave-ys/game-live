import {TiPencil} from "react-icons/ti";
import {Button} from "@/components/ui/button";
import {getStreamThumbnailApiUrl, StreamModel, UserProfileModel} from "@/api";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import {useState, useTransition} from "react";
import {updateStreamAction} from "@/actions/stream";
import {toast} from "sonner";

export type PlayerStreamModel = Omit<StreamModel, 'serverUrl' | 'streamKey' | 'thumbnailPath'> & {
  serverUrl: null;
  streamKey: null;
  thumbnailPath: null;
};

interface StreamInfoProps {
  userProfileModel: UserProfileModel;
  streamModel: PlayerStreamModel;
  className?: string;
}

export default function StreamInfo({userProfileModel, streamModel, className}: StreamInfoProps) {
  return (
    <div className={cn("m-4 rounded-xl border", className)}>
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
          {
            streamModel.thumbnailContentType ? (
              <div className="relative aspect-video rounded-md overflow-hidden w-[320px] border border-white/10">
                <img
                  width={320}
                  height={180}
                  loading={'eager'}
                  src={getStreamThumbnailApiUrl(userProfileModel.id)}
                  alt={streamModel.name}
                  className="object-cover"
                />
              </div>
            ) : <p className={"font-semibold"}>Empty</p>
          }
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="thumbnail" className="text-end">
                Thumbnail
              </Label>
              <Input type={"file"} disabled={isPending} id="thumbnail" name={"thumbnail"} className="col-span-3"/>
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