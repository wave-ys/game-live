import {LuLoader} from "react-icons/lu";

export default function StreamLoading() {
  return (
    <div className="h-full flex flex-col space-y-4 justify-center items-center">
      <LuLoader className="h-10 w-10 text-muted-foreground animate-spin"/>
      <p className="text-muted-foreground">
        Loading...
      </p>
    </div>
  );
};