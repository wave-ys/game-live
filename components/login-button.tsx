import {LOGIN_API_URL} from "@/api";
import {Button} from "@/components/ui/button";

interface LoginButtonProps {
  className?: string;
}

export default function LoginButton({className}: LoginButtonProps) {
  return (
    <a href={LOGIN_API_URL} className={className}>
      <Button variant={"outline"}>Log In</Button>
    </a>
  )
}