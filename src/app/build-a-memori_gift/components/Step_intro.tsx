import React from "react";

type stepIntro = { [key: string]: string };
export default function Step_intro({ step, title, desc }: stepIntro) {
  return (
    <div className='step_intro mt-10 mb-6'>
      <h4 className='uppercase text-center text-2xl font-extralight text-slate-500 mb-5'>{step == "4" ? "done" : `step ${step} of 3`}</h4>
      <h3 className='uppercase text-3xl text-center font-light'>{title}</h3>
      <p className='text-sm font-light text-center my-10 max-w-2xl mx-auto'>{desc}</p>
    </div>
  );
}
