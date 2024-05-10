import React from "react";

export default function User_ResetPass() {
  return (
    <div className='sm:mt-5 md:mt-0'>
      <div className='container'>
        <h4 className='font-medium uppercase text-slate-700'>change password:</h4>
        <div className='inputs'>
          <div className='old_password flex flex-col'>
            <label className='text-teal-700 text-sm font-light'>old password</label>
            <div className='input'>
              <input className='rounded outline-slate-200 pl-2' id='oldPass' type='password' placeholder='old password' />
            </div>
          </div>
          <div className='new_password flex flex-col'>
            <label className='text-teal-700 text-sm font-light'>new password</label>
            <div className='input'>
              <input className='rounded outline-slate-200 pl-2' id='newPass' type='password' placeholder='new password' />
            </div>
          </div>
          <div className='confirm_password flex flex-col'>
            <label className='text-teal-700 text-sm font-light'>confirm new password</label>
            <div className='input'>
              <input className='rounded outline-slate-200 pl-2' id='confirmPass' type='password' placeholder='confirm password' />
            </div>
          </div>
        </div>
        <div className='update_pass flex justify-end mt-5'>
          <button className='text-red-700 bg-red-50 border-red-700 rounded px-2'>update password</button>
        </div>
      </div>
    </div>
  );
}
