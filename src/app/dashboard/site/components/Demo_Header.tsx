"use client";
import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "../../components/client/inputs";
import { confirmUploadImages, getUploadSession, toastStyles, uploadImage } from "@/utils";
import toast from "react-hot-toast";
import { updateSiteHeader } from "../../_actions/updateSiteHeader";

export default function Demo_Header({ id, title }: { id: string; title: string }) {
  const textAreaDesc = useRef<HTMLTextAreaElement>(null);
  const [header_title, setHeader_Title] = useState(title);
  const [header_cover, setHeader_cover] = useState<File | null>(null);
  function textAreaAutoResize({ target: textarea }: React.ChangeEvent<HTMLTextAreaElement>) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    textarea.parentElement!.style.height = textarea.scrollHeight + "px";

    setHeader_Title(textarea.value);
  }
  function changeCoverHandler({ currentTarget: input }: React.ChangeEvent<HTMLInputElement>) {
    if (!input.files) return;
    const coverImage = input.files[0];
    let src = URL.createObjectURL(coverImage);
    if (window) {
      const demoHeader = document.querySelector(".demo_header_wrapper");
      if (demoHeader) {
        demoHeader.setAttribute("style", `background-image: url('${src}')`);
        setHeader_cover(input.files[0]);
      }
    }
  }

  async function updateHeader() {
    const alert = toast;
    if (header_cover) {
      const uploadSession = await getUploadSession();
      if (!uploadSession) return alert.error("something went wrong please try again", { style: toastStyles });
      const coverId = `${new Date().getTime()}`;
      const coverName = header_cover.name;
      alert.loading("updating...", { style: toastStyles });
      await uploadImage(header_cover, coverId, uploadSession, "", async (err, res) => {
        if (err || !res.upload) {
          alert.remove();
          return alert.error("there was a problem during uploading", { style: toastStyles });
        }
        await confirmUploadImages([{ name: `upat_${res.id}_${coverName}` }], "").then(async (confirmRes) => {
          if (!confirmRes.confirmation) {
            alert.remove();
            return alert.error("there was a problem complete uploading", { style: toastStyles });
          }

          const updateReq = await updateSiteHeader(id, confirmRes.uploads[0], header_title);
          if (!updateReq.success) {
            alert.remove();
            return alert.error(updateReq.error, { style: toastStyles });
          }
          alert.remove();
          alert.success("uploading complete successfully!", { style: toastStyles });
        });
      });
    }
  }

  useEffect(() => {
    const textarea = textAreaDesc.current;
    if (textarea) {
      textarea.value = title;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, []);

  return (
    <div className=''>
      <div className='demo_header_hero_content mt-40 mb-20 px-2 '>
        <div className='demo_header_hero_title max-w-screen-md'>
          <textarea ref={textAreaDesc} onInput={textAreaAutoResize} className='w-full text-end text-[clamp(2rem,5vw,4rem)] bg-transparent resize-none outline-none focus:border focus:border-white rounded overflow-hidden' name='title' id='title' value={header_title}></textarea>
        </div>
        <div className='demo_header_hero_desc mt-4'>
          <p className='text-end text-lg'>Since 2014. Let us do the gift wrapping for you.</p>
        </div>
      </div>
      <div className='actions flex justify-evenly mb-4'>
        <div className='change_cover border border-white rounded px-2'>
          <label htmlFor='cover' className='cursor-pointer py-px text-sm'>
            change cover
          </label>
          <input onChange={changeCoverHandler} type='file' name='header_cover' id='cover' hidden />
        </div>
        <div className='change_title  border border-white rounded px-2'>
          <label htmlFor='title' className='cursor-pointer py-px text-sm'>
            change title
          </label>
        </div>
        <div className='confirm_uploads flex flex-col justify-end'>
          <button onClick={updateHeader} className='text-teal-300 bg-slate-600 border-teal-400 rounded border px-2 text-center'>
            save changes
          </button>
        </div>
      </div>
    </div>
  );
}
