import { UPLOAD_URL, uploadImage } from "@/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

type uploadInputType = {
  setUploads: (image: { id: string; name: string; src: string }) => void;
  folder: "premade" | "item" | "card" | "variant" | "blog";
};
type T_uploadingImageItem = {
  id: string;
  src: string;
  pending: boolean;
};

export function UploadInput({ setUploads, folder }: uploadInputType) {
  console.log("render upload input");

  let [uploadingImages, addUploadingImage] = useState<T_uploadingImageItem[]>([]);
  let [sessionId, setSessionId] = useState<string | null>(null);

  // init new session
  useEffect(() => {
    fetch(UPLOAD_URL)
      .then((response) => response.json())
      .then((res) => {
        if (res.init) {
          setSessionId(res.sessionID);
        } else {
          console.error("something went wrong!");
        }
      });
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

          // add image to uploading list
          addUploadingImage((prev) => [
            ...prev,
            {
              id,
              src,
              pending: true,
            },
          ]);

          uploadImage(file, id, sessionId as string, folder, (err, res) => {
            if (!res.upload) {
              console.log(err);
              return;
            }
            // return the uploaded image
            setUploads({
              id: res.id,
              src: `${UPLOAD_URL}/images/${folder}/upat_${id}_${name}`,
              name: `upat_${id}_${name}`,
            });

            // filter uploading images by getting the pending images only
            addUploadingImage((prev) => prev.filter((image) => image.id !== res.id));
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
      // add image to uploading list
      addUploadingImage((prev) => [
        ...prev,
        {
          id,
          src,
          pending: true,
        },
      ]);
      // start uploading image
      uploadImage(input.files![i], id, sessionId as string, folder, (err, res) => {
        if (!res.upload) {
          console.log(err);
          return;
        }
        // return the uploaded image
        setUploads({
          id: res.id,
          src: `${UPLOAD_URL}/images/${folder}/upat_${id}_${name}`,
          name: `upat_${id}_${name}`,
        });
        // filter uploading images by getting the pending images only
        addUploadingImage((prev) => prev.filter((image) => image.id !== res.id));
      });
    }
    input.value = "";
  }

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
      <div className='uploading_images my-2 grid gap-5 grid-cols-[repeat(auto-fit,_theme(width.28))] justify-evenly'>
        {uploadingImages.map(({ id, pending, src }, i) => (
          <div key={i} className='chosed_image relative h-full w-28 rounded-md shadow p-1'>
            <figure className='overflow-hidden rounded h-full'>
              <Image src={src} alt='chosed_image' width={470} height={470} className='object-contain' />
            </figure>
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
    </div>
  );
}
