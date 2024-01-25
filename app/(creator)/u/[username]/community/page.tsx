import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {getBlockedUsers} from "@/api/block";
import {format} from "date-fns";
import UnblockButton from "@/app/(creator)/u/[username]/community/_components/unblock-button";

export default async function CommunityPage() {
  const blocked = await getBlockedUsers();
  return (
    <div className={"p-6"}>
      <h1 className={"font-semibold text-2xl"}>Community Settings</h1>
      <div className={"mt-8 rounded-md border"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={"text-center"}>Username</TableHead>
              <TableHead className={"text-center"}>Date Blocked</TableHead>
              <TableHead className={"text-center"}>Operation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              blocked.map(item => (
                <TableRow key={item.id}>
                  <TableCell className={"text-center"}>{item.username}</TableCell>
                  <TableCell className={"text-center"}>{format(new Date(item.createdAt), "dd/MM/yyyy")}</TableCell>
                  <TableCell className={"text-center"}><UnblockButton userId={item.id}/></TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    </div>
  )
}