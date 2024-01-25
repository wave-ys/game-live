import {cn} from "@/lib/utils";

export default function LiveBadge({className}: { className?: string }) {
  return (
    <div className={cn("rounded bg-red-400 text-white font-semibold text-xs py-1 px-1.5 w-fit", className)}>
      LIVE
    </div>
  )
}