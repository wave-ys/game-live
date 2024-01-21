import {cn} from "@/lib/utils";

interface StreamCharProps {
  className?: string;
}

export default function StreamChart({className}: StreamCharProps) {
  return <div className={cn(className)}>Chart</div>
}