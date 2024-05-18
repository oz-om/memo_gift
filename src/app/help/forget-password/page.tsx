"use client";
import { senEmail } from "@/app/action";
import { toastStyles } from "@/utils";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Forget_Password_Page() {
  const [confirmRequest, setConfirmReq] = useState({
    pending: true,
    success: false,
    responseMessage: {
      title: "",
      message: "",
    },
  });
  const [pending, setPending] = useState(false);

  const alert = toast;
  async function submitResetRequest(form: React.FormEvent<HTMLFormElement>) {
    form.preventDefault();
    const formData = new FormData(form.currentTarget);
    alert.loading("sending...", { style: toastStyles });
    setPending(true);
    const confirmReq = await senEmail(formData);
    alert.remove();
    setPending(false);
    if (!confirmReq.success) {
      setConfirmReq({
        pending: false,
        success: false,
        responseMessage: {
          title: "error: request was field ",
          message: confirmReq.error,
        },
      });
      return;
    }
    setConfirmReq({
      pending: false,
      success: true,
      responseMessage: {
        title: "success: A password reset email has been sent",
        message: "Please check your email you provide, If you den't receive the email within 5 minutes, check your spam/junk folder Or try again",
      },
    });
  }

  return (
    <main>
      <div className='reset_wrapper'>
        {!confirmRequest.pending && (
          <div className={"max-w-lg mx-auto rounded border mb-5 p-4 " + (confirmRequest.success ? "border-teal-500 bg-teal-100 text-teal-500" : "border-red-500 bg-red-100 text-red-500")}>
            <p className={"text text-center "}>{confirmRequest.responseMessage.title}</p>
            <p className={" text-xs text-center "}>{confirmRequest.responseMessage.message}</p>
          </div>
        )}
        <div className='max-w-80 rounded-lg shadow-md mx-auto p-4'>
          <h4 className='text-lg  mb-5'>Lost Password Reset</h4>
          <p className='text-sm text-slate-600'>Forgotten your password? Enter your email address below to begin the reset process.</p>
          <form onSubmit={submitResetRequest} className='mt-2'>
            <div className='email flex flex-col gap-y-2'>
              <label htmlFor='email'>Email Address:</label>
              <input className='rounded-md bg-blue-100 text-slate-500 outline-0 focus:ring-1 focus:ring-blue-300 px-2 py-1' type='email' name='email' id='email' placeholder='enter email' required />
            </div>
            <div className='submit flex justify-center my-5'>
              <button disabled={pending} type='submit' className={"bg-slate-500 rounded-md px-3 py-1  " + (pending ? "pointer-events-none text-teal-100" : "cursor-pointer text-teal-300")}>
                submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
