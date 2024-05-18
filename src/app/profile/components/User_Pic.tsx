"use client";
import { UPLOAD_URL, confirmUploadImages, toastStyles, uploadImage } from "@/utils";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { updateUserPick } from "../actions";

export default function User_Pic({ userId, user_pic }: { userId: string; user_pic: string }) {
  const [insertedImage, setInsertedImage] = useState<{ file: File | undefined; url: string }>({
    file: undefined,
    url: user_pic,
  });
  const [pending, setPending] = useState(false);
  const [imageUploadSession, setImageUploadSession] = useState<string | null>(null);
  const [isUpdated, setIsUpdated] = useState(false);
  function pickPreview({ currentTarget: fileInput }: React.ChangeEvent<HTMLInputElement>) {
    const Image = fileInput.files?.[0];
    if (!Image) return;
    setInsertedImage({
      url: URL.createObjectURL(Image),
      file: Image,
    });
    if (!imageUploadSession) {
      const alert = toast;
      alert.loading("just a second...", { style: toastStyles });
      fetch(UPLOAD_URL)
        .then(async (res) => {
          const uploadSession: { init: boolean; sessionID: string } | undefined = await res.json();
          alert.remove();
          if (!uploadSession?.init) return;
          setImageUploadSession(uploadSession.sessionID);
          setIsUpdated(true);
        })
        .catch(() => alert.remove());
    } else {
      setIsUpdated(true);
    }
  }
  async function updateProfilePick() {
    const alert = toast;
    if (!insertedImage.file || !imageUploadSession) return alert.error("please chose an image to upload!", { style: toastStyles });
    alert.loading("uploading...", { style: toastStyles });
    setPending(true);
    const imageId = new Date().getTime();
    const imageName = insertedImage.file.name;
    await uploadImage(insertedImage.file, `${imageId}`, imageUploadSession, "user", async (err, res) => {
      if (err || !res.upload) {
        console.log(err);
        return alert.error("something went wrong during uploading!, please try again");
      }
      const confirmUploadRes = await confirmUploadImages([{ name: `upat_${res.id}_${imageName}` }], "user");
      if (!confirmUploadRes.confirmation) {
        return alert.error(confirmUploadRes.error, { style: toastStyles });
      }

      const updatePic = await updateUserPick(userId, `${UPLOAD_URL}/images/${confirmUploadRes.uploads[0]}`);
      alert.remove();
      if (!updatePic.success) return alert.error(updatePic.error, { style: toastStyles });
      alert.success("done", { style: toastStyles });
      setPending(false);
      setIsUpdated(false);
    });
  }

  return (
    <div className='container flex gap-x-4 items-center'>
      <figure className='overflow-hidden rounded-full border-teal-700 border-2 size-20 shrink-0'>
        <Image src={insertedImage.url} alt={"user profile"} width={240} height={120} />
      </figure>
      <div className='change_pick bg-slate-100 text-teal-500 rounded px-2 flex gap-x-2 items-center'>
        <input onChange={pickPreview} type='file' name='user_pick' id='userPick' hidden className='hidden' />
        <label htmlFor='userPick' className='cursor-pointer text-sm'>
          change pick
        </label>
        {isUpdated && (
          <button disabled={pending} onClick={updateProfilePick} className={"text-teal-300 border border-teal-400 rounded px-2 " + (pending ? "bg-slate-300" : "bg-slate-500")}>
            save
          </button>
        )}
      </div>
    </div>
  );
}
