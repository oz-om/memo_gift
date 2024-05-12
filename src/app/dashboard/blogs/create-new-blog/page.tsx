import "quill/dist/quill.snow.css";
import Link from "next/link";
import BlogInfo from "../components/BlogInfo";
import WriteContent from "../components/WriteContent";
import "./styles/index.css";
import { UPLOAD_URL } from "@/utils";
export default async function NewBlog() {
  const uploadSessionReq = await fetch(UPLOAD_URL, { cache: "no-cache" });
  const uploadSession: { init: boolean; sessionID: string } | undefined = await uploadSessionReq.json();

  return (
    <>
      <nav className='border-b pb-2 flex justify-between'>
        <Link href={"/dashboard/blogs/"} className='flex items-center gap-1 bg-slate-100 rounded shadow  w-fit px-1'>
          <i className='bx bx-arrow-back'></i>
          <span>back</span>
        </Link>
        <div className='publish relative'>
          <BlogInfo uploadImagesSession={uploadSession} />
        </div>
      </nav>
      <section>
        <WriteContent uploadImagesSession={uploadSession} />
      </section>
    </>
  );
}
