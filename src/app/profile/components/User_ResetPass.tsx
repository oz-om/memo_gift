"use client";
import { updateUserPassword } from "@/app/action";
import { toastStyles } from "@/utils";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function User_ResetPass({ userId }: { userId: string }) {
  const [inputs, setInputs] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [pending, setPending] = useState(false);
  function handelInputs({ currentTarget }: React.FormEvent<HTMLInputElement>) {
    const fieldName = currentTarget.name;
    setInputs((prev) => ({
      ...prev,
      [fieldName]: currentTarget.value,
    }));
  }
  async function updatePasswordRequest() {
    const alert = toast;
    if (inputs.new_password.trim().length == 0 || inputs.confirm_new_password.trim().length == 0 || inputs.old_password.trim().length == 0) {
      return alert.error("please enter all fields", { style: toastStyles });
    }
    if (inputs.new_password !== inputs.confirm_new_password) {
      return alert.error("passwords must be matched", { style: toastStyles });
    }
    setPending(true);
    alert.loading("just a second...", { style: toastStyles });
    const updatePassReq = await updateUserPassword(inputs.confirm_new_password, userId, false, inputs.old_password);
    alert.remove();
    setPending(false);
    if (!updatePassReq.success) {
      return alert.error(updatePassReq.error, { style: toastStyles });
    }
    alert.success("done", { style: toastStyles });
  }
  return (
    <div className='sm:mt-5 md:mt-0'>
      <div className='container'>
        <h4 className='font-medium uppercase text-slate-700'>change password:</h4>
        <div className='inputs'>
          <div className='old_password flex flex-col'>
            <label className='text-teal-700 text-sm font-light'>old password</label>
            <div className='input'>
              <input onInput={handelInputs} className='rounded outline-slate-200 pl-2' name='old_password' id='oldPass' type='password' placeholder='old password' />
            </div>
          </div>
          <div className='new_password flex flex-col'>
            <label className='text-teal-700 text-sm font-light'>new password</label>
            <div className='input'>
              <input onInput={handelInputs} className='rounded outline-slate-200 pl-2' name='new_password' id='newPass' type='password' placeholder='new password' />
            </div>
          </div>
          <div className='confirm_password flex flex-col'>
            <label className='text-teal-700 text-sm font-light'>confirm new password</label>
            <div className='input'>
              <input onInput={handelInputs} className='rounded outline-slate-200 pl-2' name='confirm_new_password' id='confirmPass' type='password' placeholder='confirm password' />
            </div>
          </div>
        </div>
        <div className='update_pass flex justify-end mt-5'>
          <Link href={"/help/forget-password"} className='mr-auto text-xs text-blue-400'>
            forget password?
          </Link>
          <button disabled={pending} onClick={updatePasswordRequest} className={" bg-red-50 border-red-700 rounded px-2 " + (pending ? "text-red-100" : "text-red-700")}>
            update password
          </button>
        </div>
      </div>
    </div>
  );
}
