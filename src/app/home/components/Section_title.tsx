import React from "react";

type sectionTitle = {
  className?: string;
  title: string;
};
export default function Section_title({ className, title }: sectionTitle) {
  return (
    <div className={"mb-9 " + className}>
      <h4 className='uppercase font-serif mx-auto relative py-5 text-center after:content-[""] after:absolute after:w-8 after:bottom-0 after:h-1 after:bg-slate-400 after:rounded-md after:left-0 after:right-0 after:mx-auto'>{title}</h4>
    </div>
  );
}
