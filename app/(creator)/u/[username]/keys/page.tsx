import {Button} from "@/components/ui/button";
import UrlCard from "@/app/(creator)/u/[username]/keys/_components/url-card";
import KeyCard from "@/app/(creator)/u/[username]/keys/_components/key-card";

export default function KeysPage() {
  return (
    <>
      <div className={"flex items-center justify-between"}>
        <h1 className={"font-semibold text-2xl"}>Keys & URLs</h1>
        <Button type={"button"}>Generate Connection</Button>
      </div>
      <div className={"mt-8 space-y-6"}>
        <UrlCard value={""}/>
        <KeyCard value={""}/>
      </div>
    </>
  );
}