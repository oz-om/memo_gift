"use client";
import Chosed_image from "@/app/dashboard/components/client/Chosed_image";
import { UploadInput } from "@/app/dashboard/components/client/inputs/UploadInput";
import React, { useState } from "react";
import { signal } from "signals-react-safe";
import { postcardUpdateDetails } from "./UpdatePostcardDetails";

export const newUploadedImage = signal<{ name: string; id: string }[]>([]);

export default function PostcardImages({ postcardImage }: { postcardImage: string }) {
  const [image, setNewImage] = useState<string>(postcardImage);

  function addNewImage(image: { id: string; name: string; src: string }) {
    setNewImage(image.src);
    postcardUpdateDetails.value.image = image.src;
    newUploadedImage.value = [{ id: image.id, name: image.name }];
  }

  function deleteImage(targetImage: string) {
    return;
  }

  return (
    <div className='images_wrapper'>
      <div className='grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(112px,_1fr))] lg:grid-cols-4'>
        <Chosed_image id={image} src={image} removeImage={deleteImage} />
      </div>
      <div className='upload_new_image mt-4'>
        <UploadInput setUploads={addNewImage} reset={false} />
      </div>
    </div>
  );
}
