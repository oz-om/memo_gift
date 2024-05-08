"use client";
import { T_setInputsValue } from "@/types/types";
import { toastStyles } from "@/utils";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { signal } from "signals-react-safe";
import Input from "../../components/client/inputs";
import { UploadInput } from "../../components/client/inputs/UploadInput";
import { createNewPostCard } from "../../_actions/actions";
import Chosed_image from "../../components/client/Chosed_image";

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

const setPostCard: T_setInputsValue = (field, value) => {
  postCardData.value = {
    ...postCardData.value,
    [field]: value,
  };
};

let uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL as string;
export default function Postcard() {
  let [reset, setReset] = useState(false);
  async function createPostCard() {
    console.log(postCardData.value);

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
      body: JSON.stringify({ folder: "card", images: postCardData.value.images }),
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
        <PostCardChosedImage />
      </div>
      <div className='publish_wrapper '>
        <button onClick={createPostCard} className='px-4 py-1 bg-teal-500 text-white rounded-md w-28 block ml-auto mr-5 hover:bg-teal-700'>
          publish
        </button>
      </div>
    </div>
  );
}

function PostCardChosedImage() {
  const [chosedImages, setChosedImages] = useState<{ src: string; id: string }[]>([]);
  function getUploadedImage(image: { name: string; id: string; src: string }) {
    setChosedImages((prev) => [...prev, { src: image.src, id: image.id }]);
    postCardData.value.images = [...postCardData.value.images, { name: image.name, id: image.id }];
  }
  function removeChosedImage(id: string) {
    setChosedImages((prev) => prev.filter((image) => image.id !== id));
    postCardData.value.images = postCardData.value.images.filter((image) => image.id !== id);
  }
  return (
    <>
      <div className='chosed_images_wrapper'>
        <div className='grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(112px,_1fr))] lg:grid-cols-4'>
          {chosedImages.map(({ src, id }) => (
            <Chosed_image key={id} id={id} src={`${src}`} removeImage={removeChosedImage} />
          ))}
        </div>
      </div>
      {chosedImages.length == 0 ? <p className='text-slate-400 text-center text-xs py-2 border rounded-md mb-2 h-full grid place-content-center'>there is no images added yet</p> : ""}
      <UploadInput setUploads={getUploadedImage} folder='card' />
    </>
  );
}
