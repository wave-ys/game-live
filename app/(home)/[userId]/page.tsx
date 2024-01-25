import {notFound} from "next/navigation";
import {getUserByIdApi} from "@/api/user";


interface UserPageProps {
  params: {
    userId: string
  }
}

export default async function UserPage({params}: UserPageProps) {
  const user = await getUserByIdApi(params.userId);
  if (user === null)
    notFound();

  return (
    <div>
      <p>{user.username}</p>
    </div>
  )
}