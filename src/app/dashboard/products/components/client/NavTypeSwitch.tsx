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
  if (path !== "/dashboard/products") {
    return <></>;
  }
  return (
    <div className='choices flex gap-x-3 ml-3 border-b '>
      <Nav_Link query={"premade-gifts"} name='Premade Gifts' currentQuery={type} />
      <Nav_Link query={"items"} name='Items' currentQuery={type} />
      <Nav_Link query={"postcards"} name='Post Cards' currentQuery={type} />
      <Nav_Link query={"variants"} name='Variants' currentQuery={type} />
    </div>
  );
}
