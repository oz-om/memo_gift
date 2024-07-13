"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function Nav_Link({ query, name, currentQuery }: { [key: string]: string }) {
  let ActiveChoice = query == currentQuery;
  return (
    <Link href={"?type=" + query} className={"choice relative overflow-hidden w-28 text-center pb-1 " + (ActiveChoice && "text-teal-500 active-choice")}>
      {name}
    </Link>
  );
}
export default function NavTypeSwitch() {
  const type = useSearchParams().get("type") || "";
  const path = usePathname();
  if (path !== "/dashboard/orders") {
    return <></>;
  }
  return (
    <div className='choices flex gap-x-3 ml-3 border-b '>
      <Nav_Link query={"all"} name='All' currentQuery={type} />
      <Nav_Link query={"pending"} name='Pending' currentQuery={type} />
      <Nav_Link query={"shipped"} name='Shipped' currentQuery={type} />
      <Nav_Link query={"rejected"} name='Rejected' currentQuery={type} />
    </div>
  );
}
