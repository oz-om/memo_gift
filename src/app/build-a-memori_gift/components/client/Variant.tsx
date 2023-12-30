"use client";
import { Variant } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";
import { createBuiltBox } from "../../actions";

export default function Variants({ variant }: { variant: Variant }) {
  let router = useRouter();
  async function initializeNewBox(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    let loa = toast;
    loa.loading("just a second...", {
      style: {
        backgroundColor: "#ddf3f3",
        padding: "2px",
        fontSize: "12px",
      },
    });
    let res = await createBuiltBox(variant.id);
    if (!res.create) {
      toast.error(`${res.error}`, {
        style: {
          padding: "2px",
          fontSize: "12px",
        },
      });
      return;
    }
    console.log(res);

    loa.dismiss();
    router.push("?step=two&pack=" + variant.name + "&id=" + res.boxId);
  }
  return (
    <Link onClick={initializeNewBox} key={variant.name} href={"?step=two&pack=" + variant.name}>
      <figure className='cursor-pointer'>
        <Image src={`${variant.preview}`} alt={"Original Creme"} width={713} height={556} />
        <figcaption className='text-center'>{variant.name}</figcaption>
      </figure>
    </Link>
  );
}
