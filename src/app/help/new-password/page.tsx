"use client";
import { isTokenValid, updateUserPassword } from "@/app/action";
import { toastStyles } from "@/utils";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function NewPasswordPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [inputs, setInputs] = useState({
    new_password: "",
    confirm_new_password: "",
  });
  const [pending, setPending] = useState(false);

  const router = useRouter();
  const searchparams = useSearchParams();
  const token = searchparams.get("token");

  function handelInputs({ currentTarget }: React.FormEvent<HTMLInputElement>) {
    const fieldName = currentTarget.name;
    setInputs((prev) => ({
      ...prev,
      [fieldName]: currentTarget.value,
    }));
  }
  async function updatePassword() {
    const alert = toast;
    if (inputs.new_password.trim().length == 0 || inputs.confirm_new_password.trim().length == 0) {
      return alert.error("invalid password", { style: toastStyles });
    }
    if (inputs.new_password !== inputs.confirm_new_password) {
      return alert.error("passwords must be matches", { style: toastStyles });
    }

    if (!userId) return;
    setPending(true);
    alert.loading("just a second...", { style: toastStyles });
    const updateReq = await updateUserPassword(inputs.confirm_new_password, userId);
    alert.remove();
    setPending(false);
    if (!updateReq.success) {
      return alert.error(updateReq.error, { style: toastStyles });
    }
    router.push("/");
  }

  useEffect(() => {
    if (!token) {
      return notFound();
    }
    isTokenValid(token)
      .then((response) => {
        if (!response.success) {
          router.push("/");
          return;
        }
        setUserId(response.userId);
      })
      .catch(() => {
        router.push("/");
      });
  }, []);

  return (
    <main>
      <div className='container max-w-80 mx-auto bg-slate-50 shadow rounded p-4 my-10'>
        <h4 className=' uppercase text-slate-700 text-center mb-5'>Reset password</h4>
        <div className='inputs'>
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
          <button disabled={pending} onClick={updatePassword} className={" bg-red-50 border-red-700 rounded px-2 " + (pending ? "text-red-100" : "text-red-700 ")}>
            update password
          </button>
        </div>
      </div>
    </main>
  );
}
