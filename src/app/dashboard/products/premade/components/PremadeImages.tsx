"use client";
import { UploadInput } from "@/app/dashboard/components/client/inputs/UploadInput";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSignalEffect } from "signals-react-safe";
import { premadeUpdateDetails, reset } from "./UpdatePremadeDetails";

export default function PremadeImages({ premadeImages }: { premadeImages: string }) {
  let imagesArray: string[] = JSON.parse(premadeImages);
  const [images, setNewImage] = useState<string[]>(imagesArray);
  const [resetUpload, setResetUpload] = useState(false);
  function addNewImage(fieldType: string, uploadImages: { id: string; name: string }[]) {
    if (uploadImages.length == 0) {
      return;
    }
    setNewImage((prev) => [...prev, ...uploadImages.map((upload) => `https://omzid.serv00.net/images/${upload.name}`)]);
    premadeUpdateDetails.value.images = JSON.stringify([...images, ...uploadImages.map((upload) => `https://omzid.serv00.net/images/${upload.name}`)]);
  }
  function deleteImage(targetImage: string) {
    const kippedImages = images.filter((image) => image !== targetImage);
    premadeUpdateDetails.value.images = JSON.stringify(kippedImages);
    setNewImage(kippedImages);
  }

  useSignalEffect(() => {
    if (reset.value) {
      setResetUpload(reset.value);
    }
  });

  return (
    <div className='images_wrapper'>
      <div className='grid gap-5 min-[300px]:grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] lg:grid-cols-4'>
        {images.map((image, i) => {
          return (
            <div key={i} className='image border rounded p-2'>
              <figure className='overflow-hidden rounded border'>
                <Image src={image} alt='premade image' width={180} height={180} />
              </figure>
              <div className='remove mt-2'>
                <button onClick={() => deleteImage(image)} className='text-red-400 text-xs bg-red-50 rounded px-2 py-1 block w-20 ml-auto border border-transparent hover:border-red-300'>
                  remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className='upload_new_image mt-4'>
        <UploadInput setUploads={addNewImage} reset={resetUpload} />
      </div>
    </div>
  );
}
