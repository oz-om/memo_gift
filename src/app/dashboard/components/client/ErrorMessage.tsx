"use client";

export default function ErrorMessage({ msg, close }: { msg: string; close: () => void }) {
  return (
    <div className='error_message text-red-500 bg-red-100 rounded flex items-center px-2 py-1 gap-x-3 mx-4'>
      <p className='text-xs text-center'>{msg}</p>
      <i onClick={close} className='bx bx-x bx-border cursor-pointer'></i>
    </div>
  );
}
