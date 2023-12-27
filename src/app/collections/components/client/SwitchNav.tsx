"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SwitchNav() {
  let path = usePathname().split("/")[2] || "premade";

  return (
    <>
      <Link href={"premade"} className={"collection premade relative left-4 pr-10 whitespace-nowrap basis-32 flex-shrink-0 bg-teal-50 px-2 py-1 border border-dashed border-r-transparent rounded-l-md " + (path == "premade" && "active-collection")}>
        pre made gifts
      </Link>
      <Link href={"items"} className={"collection items hee relative right-4 pl-10 whitespace-nowrap basis-32 flex-shrink-0 bg-teal-50 px-2 py-1 border border-dashed  border-l-transparent rounded-r-md " + (path == "items" && "active-collection")}>
        single items
      </Link>
    </>
  );
}
