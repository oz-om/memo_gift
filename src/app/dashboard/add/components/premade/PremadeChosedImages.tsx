"use client";
import { UploadInput } from "@/app/dashboard/components/client/inputs/UploadInput";
import React, { useState } from "react";
import { premade } from "../../type/Premade_gift";
import Chosed_image from "../Chosed_image";

export default function PremadeChosedImages({ premadeImages }: { premadeImages: { name: string; id: string }[] }) {
  const [chosedImages, setChosedImages] = useState<{ src?: string; id: string }[]>(premadeImages);
  function getUploadedImage(image: { name: string; id: string; src: string }) {
    setChosedImages((prev) => [...prev, { src: image.src, id: image.id }]);
    premade.value.images = [...premade.value.images, { name: image.name, id: image.id }];
  }
  function removeChosedImage(id: string) {
    setChosedImages((prev) => prev.filter((image) => image.id !== id));
    premade.value.images = premade.value.images.filter((image) => image.id !== id);
  }
  return (
    <>
      <div className='chosed_images_wrapper'>
        <div className='grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] lg:grid-cols-4'>
          {chosedImages.map(({ src, id }) => (
            <Chosed_image key={id} id={id} src={`${src}`} removeImage={removeChosedImage} />
          ))}
        </div>
      </div>
      {chosedImages.length == 0 ? <p className='text-slate-400 text-center text-xs py-2 border rounded-md mb-2 h-full grid place-content-center'>there is no images added yet</p> : ""}
      <UploadInput setUploads={getUploadedImage} reset={false} />
    </>
  );
}
