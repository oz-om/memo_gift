"use client";
import Chosed_image from "@/app/dashboard/add/components/Chosed_image";
import { useEffect, useState } from "react";
import { signal } from "signals-react-safe";
let uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL as string;
type uploadInputType = { setUploads: (fieldType: string, value: any) => void; reset: boolean };
type imageItem = {
  id: string;
  src: string;
  pending: boolean;
};

let images = signal<imageItem[]>([]);
type resCallbackType = { id: string; upload: boolean; error: string; msg: string } | null;
async function uploadImage(image: File, id: string, sessionId: string, callback: (err: Error | null, res: resCallbackType, completedAt: number) => void) {
  let formDate = new FormData();
  formDate.append("image", image);
  formDate.append("id", id);
  formDate.append("sessionId", sessionId);
  fetch(uploadUrl, {
    method: "POST",
    body: formDate,
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.upload) {
        let imagesCopy = JSON.parse(JSON.stringify(images.value));
        for (let i = 0; i < imagesCopy.length; i++) {
          if (imagesCopy[i].id == res.id) {
            imagesCopy[i].pending = false;
          }
        }
        let updatedImages = imagesCopy;
        images.value = updatedImages;

        // maker render to update ui
        let completedAt = new Date().getTime();
        callback(null, res, completedAt);
      }
    })
    .catch((error) => {
      let completedAt = new Date().getTime();
      console.log(error);
      callback(new Error(error.message), null, completedAt);
    });
}

export function UploadInput({ setUploads, reset }: uploadInputType) {
  console.log("render upload input");

  let [chosedImages, setChosedImages] = useState<{ id: string; name: string }[]>([]);
  let [sessionId, setSessionId] = useState<string | null>(null);
  let [rerendering, setRerendering] = useState<number>(0);

  // init new session
  useEffect(() => {
    fetch(uploadUrl)
      .then((response) => response.json())
      .then((res) => {
        if (res.init) {
          setSessionId(res.sessionID);
        } else {
          console.error("something went wrong!");
        }
      });
    return () => {
      images.value = [];
      setChosedImages([]);
    };
  }, []);

  function dropHandler(ev: React.DragEvent<HTMLLabelElement>) {
    ev.preventDefault();
    if (!sessionId) {
      alert("pleas wait! upload zone doesn't ready yet.");
      return;
    }

    if (ev.dataTransfer.items) {
      Array.from(ev.dataTransfer.items).forEach((item, i) => {
        if (item.kind === "file" && item.getAsFile()?.type.startsWith("image/")) {
          const file = item.getAsFile() as File;
          let id = String(new Date().getTime());
          let src = URL.createObjectURL(file);
          let name = file.name;

          setImages(id, src, `upat_${id}_${name}`);

          setRerendering(+id); // rerender for update ui with new uploaded image

          uploadImage(file, id, sessionId as string, (err, res, time) => {
            if (err) {
              console.log(err);
            }
            console.log(res);
            setRerendering(time);
          });
        }
      });
    }
  }

  function dragOverHandler(ev: React.DragEvent<HTMLLabelElement>) {
    ev.preventDefault();
  }

  function setNewFile({ target: input }: React.ChangeEvent<HTMLInputElement>) {
    if (!sessionId) {
      alert("please wait! upload zone doesn't ready yet.");
      return;
    }
    if (!input.files) {
      alert("pleas wait");
      return;
    }

    for (let i = 0; i < input.files!.length; i++) {
      let id = String(new Date().getTime());
      let src = URL.createObjectURL(input.files?.[i] as File);
      let name = input.files?.[i].name;

      setImages(id, src, `upat_${id}_${name}`);

      setRerendering(+id);

      uploadImage(input.files![i], id, sessionId as string, (err, res, time) => {
        if (err) {
          console.log(err);
        }
        console.log(res);
        setRerendering(time);
      });
    }
    input.value = "";
  }

  function removeChosedImage(e: React.MouseEvent) {
    // delete image from state
    setChosedImages(chosedImages.filter(({ id }) => id != (e.target as HTMLElement).id));
    // delete images from global state (signal)

    // delete images from ui (preview images)
    images.value = images.value.filter(({ id }) => id != (e.target as HTMLElement).id);
  }

  function setImages(id: string, src: string, name: string) {
    images.value = [
      ...images.value,
      {
        id,
        src: src,
        pending: true,
      },
    ];

    setChosedImages((prev) => [
      ...prev,
      {
        id,
        name,
      },
    ]);
  }

  // when reset happen
  useEffect(() => {
    if (reset) {
      setChosedImages([]);
      images.value = [];
    }
  }, [reset]);

  // update signal state when remove/add new chosed image
  useEffect(() => {
    setUploads("images", chosedImages);
  }, [chosedImages]);

  return (
    <div className={"uploads " + (sessionId == null ? "animate-pulse pointer-events-none" : "animate-none")}>
      <label onDrop={dropHandler} onDragOver={dragOverHandler} draggable='true' htmlFor='file' className='cursor-pointer flex flex-col border-2 border-slate-400 border-dashed rounded-md'>
        <svg className='h-28' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
          <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
          <g id='SVGRepo_iconCarrier'>
            <path d='M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15' stroke='#b8ccc8' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'></path>{" "}
          </g>
        </svg>
        <div className='text-center text-[#b8ccc8] text-sm mb-2'>
          <p>Drag And Drop</p>
          <p>Browse File to upload!</p>
        </div>
        <input onChange={setNewFile} id='file' type='file' multiple className='hidden' />
      </label>
      <div className='chosed_images_wrapper'>
        <div className='images my-2 grid gap-5 grid-cols-[repeat(auto-fit,_theme(width.28))] justify-evenly'>
          {images.value.map(({ id, pending, src }, i) => (
            <div key={i} className='chosed_wrapper relative'>
              <Chosed_image id={id} image={src} removeImage={removeChosedImage} />
              {pending ? (
                <div className='overlay grid absolute w-full h-full bg-black/30 place-content-center top-0 left-0 text-white'>
                  <i className='bx bx-loader bx-sm bx-spin text-center'></i>
                  <p className='text-xs'>loading...</p>
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
        {images.value.length == 0 ? <p className='text-slate-400 text-center text-xs py-2 border rounded-md mb-2'>there is no images added yet</p> : ""}
      </div>
    </div>
  );
}
