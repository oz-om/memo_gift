import React from "react";
import { signal } from "signals-react-safe";
import Input from "../../components/Inputs";
import Chosed_image from "../components/Chosed_image";

type postCardDataType = {
  name: string;
  images: string;
};
export const postCardData = signal<postCardDataType>({
  name: "",
  images: "",
});

function setPostCard({ fieldType, value }: { fieldType: string; value: string }) {
  postCardData.value = {
    ...postCardData.value,
    [fieldType]: value,
  };
}

export default function Postcard() {
  return (
    <div className='postcard_wrapper mb-20 px-3 max-w-4xl mx-auto'>
      <Input name='name' type={"text"} placeholder='name' setValue={setPostCard} />
      <div className='item_photos_wrapper my-4'>
        <h4 className='capitalize mb-2 text-sm'>chose images:</h4>
        <label htmlFor='file' className='cursor-pointer flex flex-col border-2 border-slate-400 border-dashed rounded-md'>
          <svg className='h-28' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
            <g id='SVGRepo_iconCarrier'>
              <path d='M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15' stroke='#b8ccc8' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'></path>{" "}
            </g>
          </svg>
          <p className='text-center text-[#b8ccc8]'>Browse File to upload!</p>
          <input id='file' type='file' className='hidden' />
        </label>
        <div className='chosed_images_wrapper'>
          <Chosed_image image={"/images/card_item_01.png"} />
        </div>
      </div>
      <div className='publish_wrapper '>
        <button className='px-4 py-1 bg-teal-500 text-white rounded-md w-28 block ml-auto mr-5 hover:bg-teal-700'>publish</button>
      </div>
    </div>
  );
}
