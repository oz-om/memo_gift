"use client";
import Chosed_image from "@/app/dashboard/components/client/Chosed_image";
import { UploadInput } from "@/app/dashboard/components/client/inputs/UploadInput";
import React, { useState } from "react";
import { signal } from "signals-react-safe";
import { itemUpdateDetails } from "./UpdateItemDetails";

export const newUploadedImages = signal<{ name: string; id: string }[]>([]);

export default function ItemImages({ itemImages }: { itemImages: string }) {
  let imagesArray: string[] = JSON.parse(itemImages);
  const controlledImages = imagesArray.map((image, i) => ({
    id: "id_" + i,
    name: "name_" + i,
    src: image,
  }));
  const [images, setNewImage] = useState<{ name: string; id: string; src: string }[]>(controlledImages);

  function addNewImage(image: { id: string; name: string; src: string }) {
    setNewImage((prev) => [...prev, image]);
    itemUpdateDetails.value.images = JSON.stringify([...JSON.parse(itemUpdateDetails.value.images), image.src]);
    newUploadedImages.value.push({
      id: image.id,
      name: image.name,
    });
  }
  function deleteImage(targetImage: string) {
    const kippedImages = images.filter((image) => image.id !== targetImage);
    itemUpdateDetails.value.images = JSON.stringify(kippedImages.map((image) => image.src));
    newUploadedImages.value = newUploadedImages.value.filter((image) => image.id !== targetImage);
    setNewImage(kippedImages);
  }

  return (
    <div className='images_wrapper'>
      <div className='grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(112px,_1fr))] lg:grid-cols-4'>
        {images.map(({ id, src }) => {
          return <Chosed_image key={id} id={id} src={src} removeImage={deleteImage} />;
        })}
      </div>
      <div className='upload_new_image mt-4'>
        <UploadInput setUploads={addNewImage} folder='item' />
      </div>
    </div>
  );
}
