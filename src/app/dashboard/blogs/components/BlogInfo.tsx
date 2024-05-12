"use client";
import { T_setInputsValue } from "@/types/types";
import { UPLOAD_URL, confirmUploadImages, toastStyles, uploadImage } from "@/utils";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { signal } from "signals-react-safe";
import Input, { Textarea } from "../../components/client/inputs";
import { CategoriesInput } from "../../components/client/inputs/CategoriesInput";
import { createNewBlog } from "../../_actions/actions";

type blogDataType = {
  title: string;
  cover: string;
  desc: string;
  tags: string[];
};
type T_FieldBlog = keyof blogDataType;

const blogInfo = signal<blogDataType>({
  title: "",
  cover: "",
  desc: "",
  tags: [],
});

const setBlogInfo: T_setInputsValue = (field, value) => {
  blogInfo.value = {
    ...blogInfo.value,
    [field]: value,
  };
};

// extract all images src from blog content to confirm those images
function extractImageSrcs(htmlContent: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const imgTags = doc.getElementsByTagName("img");
  const srcUrls: string[] = [];

  for (let i = 0; i < imgTags.length; i++) {
    srcUrls.push(imgTags[i].getAttribute("src") as string);
  }

  return srcUrls;
}

export default function BlogInfo({ uploadImagesSession }: { uploadImagesSession: { init: boolean; sessionID: string } | undefined }) {
  const blogInfoAsideElement = useRef<HTMLDivElement | null>(null);
  const asideBackShadow = useRef<HTMLDivElement | null>(null);
  const [blogCover, setBlogCover] = useState<string | null>(null);
  const [resetInput, setResetInput] = useState(false);

  async function saveAndPublish() {
    const blogContent = document.querySelector(".quill-editor.ql-container .ql-editor")?.innerHTML;
    if (!blogContent) return;

    let alert = toast;

    // check if fields are not empty
    let field: T_FieldBlog;
    for (field in blogInfo.value) {
      if (blogInfo.value[field].length == 0) {
        console.log(field);

        alert.error("please enter all fields", { style: toastStyles });
        return;
      }
    }

    alert.loading("just a second...", { style: toastStyles });

    // api request
    const createBlogReq = await createNewBlog(blogContent, {
      title: blogInfo.value.title,
      cover: blogInfo.value.cover,
      desc: blogInfo.value.desc,
      tags: blogInfo.value.tags,
    });
    alert.remove();
    if (!createBlogReq.success) {
      // show error message
      alert.error(createBlogReq.error, { style: toastStyles });
      return;
    }

    // confirm uploaded images
    const blogImages = extractImageSrcs(blogContent).map((image) => ({ name: image.replace(/.*\//, "") }));
    const confirmUploadRes = await confirmUploadImages([{ name: blogInfo.value.cover.replace(/.*\//, "") }, ...blogImages], "blog");
    if (!confirmUploadRes.confirmation) {
      alert.error(confirmUploadRes.error, { style: toastStyles });
      return;
    }
    // show success message
    alert.success("done!", { style: toastStyles });
    setResetInput(true);
  }

  function toggleBlogAsideInfo() {
    if (!blogInfoAsideElement.current || !asideBackShadow.current) return;
    blogInfoAsideElement.current.classList.toggle("right-0");
    blogInfoAsideElement.current.classList.toggle("-right-full");
    asideBackShadow.current.classList.toggle("hidden");
  }

  function insertCover({ target: input }: React.ChangeEvent<HTMLInputElement>) {
    const alert = toast;

    if (!uploadImagesSession) {
      alert.error("there is a problem with images manager, refresh page and try again", { style: toastStyles });
      console.error("images server doesn't response, we cant upload images right now ");
      return;
    }

    if (!input.files) {
      alert.error("there is no image to upload!", { style: toastStyles });
      return;
    }
    alert.loading("uploading...", { style: toastStyles });

    const file = input.files[0];
    const imageId = new Date().getTime();
    const imageName = file.name;

    uploadImage(file, `${imageId}`, uploadImagesSession.sessionID, "blog", (err, res) => {
      alert.remove();
      if (!res.upload) {
        alert.error("uploading failed!", { style: toastStyles });
        console.log(err);
        return;
      }
      const imageUrl = `${UPLOAD_URL}/images/blog/upat_${imageId}_${imageName}`;
      setBlogInfo("cover", imageUrl);
      alert.success("done!", { style: toastStyles });
    });
    setBlogCover(URL.createObjectURL(file));
    input.value = "";
  }

  // reset all filed
  useEffect(() => {
    if (resetInput) {
      setBlogCover(null);
      setResetInput(false);
    }
  }, [resetInput]);
  return (
    <>
      <p onClick={toggleBlogAsideInfo} className='rounded flex gap-1 items-center bg-teal-100 text-slate-600 relative z-[2] px-2 cursor-pointer'>
        <span>publish</span>
        <i className='bx bxs-hot '></i>
      </p>
      <div ref={asideBackShadow} onClick={toggleBlogAsideInfo} className='back_ fixed left-0 top-0 w-full h-full z-[1] hidden'></div>
      <aside ref={blogInfoAsideElement} className='blog_info fixed max-w-80 w-full  top-[112px] h-[calc(100%_-_112px)] px-3 border bg-white shadow-[-8px_20px_20px_10px_#00000012] overflow-hidden custom-scroll-bar overflow-y-auto -right-full transition-[right] z-10'>
        <Input name='title' setValue={setBlogInfo} reset={resetInput} placeholder='Title' />
        <Textarea name='desc' reset={resetInput} setValue={setBlogInfo} placeholder='discretion' />
        <CategoriesInput name='tags' setValue={setBlogInfo} reset={resetInput} />
        <div className='blog_cover'>
          <div className='input'>
            <h4>blog cover</h4>
            <input type='file' onChange={insertCover} />
          </div>
          {blogCover && (
            <figure className='overview p-1 rounded m-1 bg-slate-100'>
              <Image src={blogCover} alt={"blog cover"} width={280} height={200} />
            </figure>
          )}
        </div>
        <div className='publish_button my-auto grid place-content-center py-4'>
          <button onClick={saveAndPublish} className='text-white bg-teal-400 py-1 px-2 rounded'>
            save & publish
          </button>
        </div>
      </aside>
    </>
  );
}
