"use client";
import CloseCardsDialog from "@/app/collections/components/client/CloseCardsDialog";
import { toastStyles, toggleDialog } from "@/utils";
import delay from "@/utils/delay";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { setFriendlyMessageToCartItem } from "../../build-a-memori_gift/actions";

type T_friendlyMessageFormProps = {
  called: "premade" | "item" | "customGift";
  productId: string | null;
};

export async function showErrorMessage(error: string) {
  let errorMessageBlock = document.querySelector(".collections-cards-dialog-error-message");
  errorMessageBlock?.classList.remove("hidden");
  errorMessageBlock!.textContent = error;
  await delay(1000);
  errorMessageBlock?.classList.add("hidden");
}

export default function FriendlyMessageForm(props: T_friendlyMessageFormProps) {
  const { called, productId } = props;
  const [withNote, setWithNote] = useState(true);
  const [emptyCard, setEmptyCard] = useState(false);
  const router = useRouter();
  let alert = toast;
  const params = useSearchParams();
  const path = usePathname();
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function emptyCardHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (!withNote) {
      return;
    }
    let checkbox = e.target;
    setEmptyCard(checkbox.checked);
  }

  function setWithNoteHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (emptyCard) {
      return;
    }
    let checkbox = e.target;
    setWithNote(!checkbox.checked);
  }

  function startSubmitting() {
    alert.loading("just a second...", {
      style: toastStyles,
    });
  }

  async function setFriendlyNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (called == "premade") {
      // if there is no variant selected
      if (!params.get("v")) {
        showErrorMessage("please select a variant to continue");
        return;
      }
    }
    let res = await setFriendlyMessageToCartItem({
      emptyCard,
      withNote,
      data: formData,
      called,
      productId,
      variantId: params.get("v"),
    });

    alert.dismiss();
    if (!res.success) {
      alert.error(`${res.error}`, {
        style: toastStyles,
      });
      called !== "customGift" && showErrorMessage(res.error);
    }

    if (called == "customGift") {
      let paramsString = params.toString();
      // Replace the current step value with the next one
      paramsString = paramsString.replace(/(?<=step=)[^&]+/, "three");
      router.push(`${path}?${paramsString}`);
    } else {
      toggleDialog("collections-cards-dialog");
    }
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} onSubmit={(e) => startTransition(() => setFriendlyNote(e))} className='from_to_form max-w-lg flex flex-col mx-auto md:mx-0'>
      <div className='other_options mb-6'>
        <div className='opt'>
          <input onChange={emptyCardHandler} checked={emptyCard} name='emptyCard' type='checkbox' id='blank-card' />
          <label htmlFor='blank-card'>Leave card intentionally blank and we&apos;ll tuck the card in the bow for you to do what you need</label>
        </div>
        <div className='opt'>
          <input onChange={setWithNoteHandler} checked={!withNote} name='withNote' type='checkbox' id='no-card' />
          <label htmlFor='no-card'>No card and Note needed! Just a to/from is fine!</label>
        </div>
      </div>
      <div className='inputs grid grid-cols-2 gap-10'>
        {!emptyCard && (
          <>
            <div className='to_input'>
              <label htmlFor='to'>to</label>
              <input type='text' id='to' name='to' placeholder='to' className='w-full px-3 py-1 outline-none rounded border border-teal-100 focus:border-teal-400 placeholder:font-light' />
            </div>
            <div className='form_input'>
              <label htmlFor='from'>from</label>
              <input type='text' id='from' name='from' placeholder='from' className='w-full px-3 py-1 outline-none rounded border border-teal-100 focus:border-teal-400 placeholder:font-light' />
            </div>

            {withNote && (
              <div className='massage col-span-2'>
                <textarea name='note' id='massage' placeholder='friendly message/note' className='w-full resize-none px-3 py-1 outline-none rounded border border-teal-100 focus:border-teal-400 placeholder:font-light' />
              </div>
            )}
          </>
        )}
      </div>
      {called == "customGift" ? (
        <div className='complete_box flex justify-center items-center gap-x-5 mt-5 md:mt-auto'>
          <input type={"submit"} onClick={startSubmitting} className='bg-teal-400 text-white text-center px-4 py-2 rounded-md mx-auto min-w-max w-2/5 block cursor-pointer' value={"Next Step"} />
        </div>
      ) : (
        <div className='complete_box flex justify-center max-w-60 mx-auto items-center gap-x-5 mb-3 mt-5 md:mt-auto'>
          <CloseCardsDialog />
          <button type='submit' disabled={pending} className='bg-teal-400 text-white text-center px-4 py-2 rounded-md mx-auto min-w-max w-2/5 flex items-center disabled:bg-teal-800/25 cursor-pointer'>
            add to cart
          </button>
          {pending && <i className='bx bx-loader bx-spin'></i>}
        </div>
      )}
    </form>
  );
}
