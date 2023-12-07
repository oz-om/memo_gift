"use client";

import Image from "next/image";

function toggleCardsList() {
  let open = document.querySelector(".step_three_section dialog")?.getAttribute("open");
  if (!open) {
    document.querySelector(".step_three_section dialog")?.setAttribute("open", "true");
  } else {
    document.querySelector(".step_three_section dialog")?.removeAttribute("open");
  }
}

type cardItemProps = {
  [key: string]: string;
};
export default function Card_item({ image, name }: cardItemProps) {
  function ChoseCard() {
    toggleCardsList();
  }
  return (
    <div onClick={ChoseCard} className='card cursor-pointer'>
      <figure>
        <Image src={image} alt={name} width={650} height={650} />
      </figure>
      <h4>{name}</h4>
    </div>
  );
}

export function ChoseCardButton() {
  return (
    <button onClick={() => toggleCardsList()} className='w-40 py-2 text-center text-teal-400 mx-auto block cursor-pointer'>
      Chose PostCard
    </button>
  );
}
