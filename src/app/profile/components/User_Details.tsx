"use client";

import { toastStyles } from "@/utils";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { signal } from "signals-react-safe";
import { changeUserDetailsAction } from "../actions";

type T_userDetails = Prisma.UserGetPayload<{
  select: {
    id: true;
    username: true;
    first_name: true;
    last_name: true;
    email: true;
  };
}>;

export type T_changedField = {
  id?: string;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

const oldUserInfo = signal<T_userDetails>({
  id: "",
  email: "",
  username: "",
  first_name: "",
  last_name: "",
});

export default function User_Details({ userDetails }: { userDetails: T_userDetails }) {
  const [user, updateUserInfo] = useState<T_userDetails>(userDetails);
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  function handleInputs({ currentTarget: input }: React.ChangeEvent<HTMLInputElement>) {
    const filedName = input.name as keyof T_userDetails;
    if (!isChanged) {
      setIsChanged(true);
    }
    updateUserInfo((prev) => ({
      ...prev,
      [filedName]: input.value,
    }));
  }

  async function updatedUserInfo() {
    const alert = toast;
    let changedUserInfo: T_changedField = {};
    let userInfoFiled: keyof T_userDetails;
    for (userInfoFiled in user) {
      if (user[userInfoFiled] !== oldUserInfo.value[userInfoFiled]) {
        changedUserInfo[userInfoFiled] = user[userInfoFiled];
      }
    }
    // if there is no changed field
    if (Object.keys(changedUserInfo).length == 0) return;
    setPending(true);
    alert.loading("saving...", { style: toastStyles });
    const updateRes = await changeUserDetailsAction(userDetails.id, changedUserInfo);
    alert.remove();
    setPending(false);
    if (!updateRes.success) alert.error(updateRes.error, { style: toastStyles });
    alert.success("saved successfully", { style: toastStyles });
    // update Old use Info with new Info to convert new info to old
    let newUserInfoFiled: keyof T_userDetails;
    for (newUserInfoFiled in changedUserInfo) {
      oldUserInfo.value[newUserInfoFiled] = changedUserInfo[newUserInfoFiled] as string;
    }
    setIsChanged(false);
    router.refresh();
  }

  useEffect(() => {
    oldUserInfo.value = userDetails;
    return () => {
      oldUserInfo.value = {
        id: "",
        email: "",
        username: "",
        first_name: "",
        last_name: "",
      };
    };
  }, []);

  return (
    <div className='container '>
      <h4 className='font-medium uppercase text-slate-700'>user info</h4>
      <div className='details pl-2'>
        <div className='firstName flex flex-col'>
          <label className='text-teal-700 text-sm font-light'>first name:</label>
          <div className='input flex justify-between'>
            <input onInput={handleInputs} value={user.first_name} name='first_name' className='rounded outline-slate-200 pl-2' id='firstName' type='text' placeholder='first name' />
            <label htmlFor='firstName' className='bg-slate-200 rounded px-2'>
              <i className='bx bxs-edit-alt text-teal-500'></i>
            </label>
          </div>
        </div>
        <div className='lastName flex flex-col'>
          <label className='text-teal-700 text-sm font-light'>last name:</label>
          <div className='input flex justify-between'>
            <input onInput={handleInputs} value={user.last_name} name='last_name' className='rounded outline-slate-200 pl-2' id='lastName' type='text' placeholder='last name' />
            <label htmlFor='lastName' className='bg-slate-200 rounded px-2'>
              <i className='bx bxs-edit-alt text-teal-500'></i>
            </label>
          </div>
        </div>
        <div className='fullName flex flex-col'>
          <label className='text-teal-700 text-sm font-light'>username:</label>
          <div className='input flex justify-between'>
            <input onInput={handleInputs} value={user.username} name='username' className='rounded outline-slate-200 pl-2' id='fullName' type='text' placeholder='username' />
            <label htmlFor='fullName' className='bg-slate-200 rounded px-2'>
              <i className='bx bxs-edit-alt text-teal-500'></i>
            </label>
          </div>
        </div>
        <div className='email flex flex-col'>
          <label className='text-teal-700 text-sm font-light'>email:</label>
          <div className='input flex justify-between'>
            <input onInput={handleInputs} value={user.email} name='email' className='rounded outline-slate-200 pl-2' id='email' type='text' placeholder='email' />
            <label htmlFor='email' className='bg-slate-200 rounded px-2'>
              <i className='bx bxs-edit-alt text-teal-500'></i>
            </label>
          </div>
        </div>
      </div>
      <div className='save_changes flex justify-center mt-5'>
        <button disabled={pending} onClick={updatedUserInfo} className={"border border-teal-600 rounded px-2 " + (isChanged ? "text-teal-300 bg-slate-500 " : " text-teal-200 bg-slate-400 pointer-events-none ") + (pending && " text-teal-200 bg-slate-400 pointer-events-none ")}>
          save
        </button>
      </div>
    </div>
  );
}
