"use client";
import React from "react";
import { signal } from "signals-react-safe";
import Input from "../../components/client/inputs";
import { UploadInput } from "../../components/client/inputs/UploadInput";

type postCardDataType = {
  name: string;
  images: string;
};
export const postCardData = signal<postCardDataType>({
  name: "",
  images: "",
});

function setPostCard(fieldType: string, value: any) {
  postCardData.value = {
    ...postCardData.value,
    [fieldType]: value,
  };
}

export default function Postcard() {
  return (
    <div className='postcard_wrapper mb-20 px-3 max-w-4xl mx-auto'>
      <Input name='name' type={"text"} placeholder='name' setValue={setPostCard} reset={false} />
      <div className='uploads_wrapper my-4'>
        <UploadInput setUploads={setPostCard} reset={false} />
      </div>
      <div className='publish_wrapper '>
        <button className='px-4 py-1 bg-teal-500 text-white rounded-md w-28 block ml-auto mr-5 hover:bg-teal-700'>publish</button>
      </div>
    </div>
  );
}
