import Image from "next/image";
import React from "react";

export default function User_Pick() {
  return (
    <div className='container flex gap-x-4 items-center'>
      <figure className='overflow-hidden rounded-full border-teal-700 border-2 size-20'>
        <Image src={"/images/auth_bg_01.png"} alt={"user profile"} width={240} height={120} />
      </figure>
      <div className='change_pick bg-slate-100 text-teal-500 rounded px-2'>
        <input type='file' name='user_pick' id='userPick' hidden className='hidden' />
        <label htmlFor='userPick' className='cursor-pointer text-sm'>
          change pick
        </label>
      </div>
    </div>
  );
}
