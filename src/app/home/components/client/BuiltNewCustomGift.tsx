"use client";
import { createCustomGift } from "@/app/build-a-memori_gift/actions";
import { toastStyles } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function BuiltNewCustomGift() {
  const router = useRouter();
  async function initializeNewCustomGift(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    let alert = toast;
    alert.loading("just a second...", {
      style: {
        backgroundColor: "#ddf3f3",
        ...toastStyles,
      },
    });
    let res = await createCustomGift();
    alert.dismiss();
    if (!res.create) {
      alert.error(`${res.error}`, {
        style: toastStyles,
      });
      return;
    }
    router.push("/build-a-memori_gift?step=one&cgid=" + res.customGiftId);
  }
  return (
    <Link onClick={initializeNewCustomGift} href='/build-a-memori_gift?step=one' className='uppercase py-5 px-9 text-sm whitespace-nowrap w-56 font-semibold border-2 border-teal-100 rounded-md hover:bg-white/20'>
      Build a memori_gift
    </Link>
  );
}
