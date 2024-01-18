"use client";
import { toastStyles } from "@/utils";
import { type } from "os";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { signal } from "signals-react-safe";
import Input from "../../components/client/inputs";
import { UploadInput } from "../../components/client/inputs/UploadInput";
import { createNewPostCard } from "../../_actions/actions";

type images = {
  id: string;
  name: string;
};
type postCardDataType = {
  name: string;
  images: images[];
};
type T_FieldPostCard = keyof postCardDataType;
export const postCardData = signal<postCardDataType>({
  name: "",
  images: [],
});

function setPostCard(fieldType: string, value: any) {
  postCardData.value = {
    ...postCardData.value,
    [fieldType]: value,
  };
}

let uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL as string;
export default function Postcard() {
  let [reset, setReset] = useState(false);
  async function createPostCard() {
    let alert = toast;
    let field: T_FieldPostCard;
    for (field in postCardData.value) {
      if (postCardData.value[field].length == 0) {
        alert.error("please enter all fields");
        return;
      }
    }

    alert.loading("just a second...", { style: toastStyles });
    let req = await fetch(uploadUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postCardData.value.images),
    });
    let upload = await req.json();
    if (upload.confirmation) {
      let res = await createNewPostCard({
        name: postCardData.value.name,
        image: postCardData.value.images[0].name,
      });
      alert.remove();
      if (!res.success) {
        alert.error(res.error, { style: toastStyles });
        return;
      }
      setReset(true);
      alert.success("done");
    } else {
      alert.remove();
      alert.error("something went wrong with upload file");
    }
  }
  // return reset to default
  useEffect(() => {
    if (reset == true) {
      setReset(false);
    }
  }, [reset]);
  return (
    <div className='postcard_wrapper mb-20 px-3 max-w-4xl mx-auto bg-white shadow rounded  p-4'>
      <Input name='name' type={"text"} placeholder='name' setValue={setPostCard} reset={reset} />
      <div className='uploads_wrapper my-4'>
        <UploadInput setUploads={setPostCard} reset={reset} />
      </div>
      <div className='publish_wrapper '>
        <button onClick={createPostCard} className='px-4 py-1 bg-teal-500 text-white rounded-md w-28 block ml-auto mr-5 hover:bg-teal-700'>
          publish
        </button>
      </div>
    </div>
  );
}
