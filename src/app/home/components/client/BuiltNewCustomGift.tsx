"use client";
import { createCustomGift } from "@/app/build-a-memori_gift/actions";
import { toastStyles } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function BuiltNewCustomGift({ className }: { className?: string }) {
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
    alert.remove();
    if (!res.create) {
      alert.error(`${res.error}`, {
        style: toastStyles,
      });
      return;
    }
    router.push("/build-a-memori_gift?step=one&cgid=" + res.customGiftId);
  }
  return (
    <Link onClick={initializeNewCustomGift} href='/build-a-memori_gift?step=one' className={className}>
      Build a memori_gift
    </Link>
  );
}
