"use client";
import Link from "next/link";
import React, { useState } from "react";
import { setFriendlyMessage } from "../../actions";

export default function FriendlyMessageForm({ boxId }: { boxId: string }) {
  const [note, setNote] = useState({
    withNote: true,
    note: "",
  });
  const [emptyCard, setEmptyCard] = useState({
    emptyCard: false,
    from: "",
    to: "",
  });

  function emptyCardHandler(e: React.ChangeEvent<HTMLInputElement>) {
    let checkbox = e.target;
    setEmptyCard({
      emptyCard: checkbox.checked,
      from: "",
      to: "",
    });
  }

  function setWithNoteHandler(e: React.ChangeEvent<HTMLInputElement>) {
    let checkbox = e.target;
    setNote({
      withNote: !checkbox.checked,
      note: "",
    });
  }

  async function setFriendlyNote(formData: FormData) {
    console.log(formData.get("emptyCard"));
    console.log(formData.get("note"));
    console.log(formData.get("from"));

    // let res = await setFriendlyMessage(boxId, {
    //   from:'',
    //   to:'',
    //   note:'',
    //   withNote:true,
    //   emptyCard:true
    // })
  }
  return (
    <form action={setFriendlyNote} className='from_to_form max-w-lg flex flex-col mx-auto md:mx-0'>
      <div className='other_options mb-6'>
        <div className='opt'>
          <input onChange={emptyCardHandler} name='emptyCard' type='checkbox' id='blank-card' />
          <label htmlFor='blank-card'>Leave card intentionally blank and we&apos;ll tuck the card in the bow for you to do what you need</label>
        </div>
        <div className='opt'>
          <input onChange={setWithNoteHandler} name='withNote' type='checkbox' id='no-card' />
          <label htmlFor='no-card'>No card and Note needed! Just a to/from is fine!</label>
        </div>
      </div>
      <div className='inputs grid grid-cols-2 gap-10'>
        {!emptyCard.emptyCard && (
          <>
            <div className='to_input'>
              <label htmlFor='to'>to</label>
              <input type='text' id='to' name='to' placeholder='to' className='w-full px-3 py-1 outline-none rounded border border-teal-100 focus:border-teal-400 placeholder:font-light' />
            </div>
            <div className='form_input'>
              <label htmlFor='from'>from</label>
              <input type='text' id='from' name='from' placeholder='from' className='w-full px-3 py-1 outline-none rounded border border-teal-100 focus:border-teal-400 placeholder:font-light' />
            </div>
          </>
        )}
        {note.withNote && (
          <div className='massage col-span-2'>
            <textarea name='massage' id='massage' dirName='note' placeholder='friendly message/note' className='w-full resize-none px-3 py-1 outline-none rounded border border-teal-100 focus:border-teal-400 placeholder:font-light'></textarea>
          </div>
        )}
      </div>
      <div className='complete_box flex justify-center items-center gap-x-5 mt-5 md:mt-auto'>
        <input type={"submit"} className='add_to_cart py-1 px-3 border border-teal-400 text-teal-400 rounded' value={"add to cart"} />
        <input type={"submit"} className='checkout py-1 px-3 border bg-teal-400 text-white rounded' value={"checkout"} />
      </div>
    </form>
  );
}
