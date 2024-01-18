"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function Nav_Link({ query, name, currentQuery }: { [key: string]: string }) {
  let ActiveChoice = query == currentQuery;
  return (
    <Link href={"?type=" + query} className={"choice relative overflow-hidden w-28 text-center pb-1 " + (ActiveChoice && "text-teal-500 active-choice")}>
      {name}
    </Link>
  );
}
export default function Add_nav_type() {
  const type = useSearchParams().get("type") || "";
  return (
    <div className='choices flex gap-x-3 ml-3 border-b '>
      <Nav_Link query={"premade-gift"} name='Premade Gift' currentQuery={type} />
      <Nav_Link query={"item"} name='Item' currentQuery={type} />
      <Nav_Link query={"postcard"} name='Post Card' currentQuery={type} />
      <Nav_Link query={"variant"} name='Variant' currentQuery={type} />
    </div>
  );
}
