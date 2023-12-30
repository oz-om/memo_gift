"use client";
import { toastStyles } from "@/utils";
import { Variant } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";
import { createCustomGift } from "../../actions";

export default function Variants({ variant }: { variant: Variant }) {
  let router = useRouter();
  async function initializeNewBox(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    let alert = toast;
    alert.loading("just a second...", {
      style: {
        backgroundColor: "#ddf3f3",
        ...toastStyles,
      },
    });
    let res = await createCustomGift(variant.id);
    alert.dismiss();
    if (!res.create) {
      alert.error(`${res.error}`, {
        style: toastStyles,
      });
      return;
    }
    router.push("?step=two&pack=" + variant.name + "&cgid=" + res.customGiftId);
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
