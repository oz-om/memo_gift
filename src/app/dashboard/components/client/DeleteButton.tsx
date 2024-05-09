"use client";

import { toastStyles } from "@/utils";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { toast } from "react-hot-toast";
import { deleteTarget, PrismaModels } from "../../_actions/deleteAction";

export default function DeleteButton({ id, target }: { id: string; target: PrismaModels }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function deleteHandler() {
    try {
      await deleteTarget(target, id);
      router.refresh();
    } catch (error) {
      toast.error(`${error}`, {
        style: toastStyles,
      });
    }
  }

  return (
    <button onClick={() => startTransition(deleteHandler)} disabled={pending} className='w-fit px-4 py-1  text-red-500 rounded-md text-xs'>
      {pending ? <i className='bx bx-loader bx-spin'></i> : "delete"}
    </button>
  );
}
