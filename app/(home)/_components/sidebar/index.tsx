import SidebarWrapper from "@/app/(home)/_components/sidebar/wrapper";
import SidebarToggle from "@/app/(home)/_components/sidebar/toggle";
import Recommended from "@/app/(home)/_components/sidebar/recommended";
import getRecommendedApi from "@/api/recommended";
import {getFollowingUsersApi} from "@/api/follow";
import Following from "@/app/(home)/_components/sidebar/following";

export default async function Sidebar() {
  const recommended = await getRecommendedApi();
  const following = await getFollowingUsersApi();

  return (
    <SidebarWrapper>
      <SidebarToggle/>
      <div className={"space-y-3.5"}>
        <Following list={following}/>
        <Recommended list={recommended}/>
      </div>
    </SidebarWrapper>
  )
}