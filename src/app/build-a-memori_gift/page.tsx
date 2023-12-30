import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Step_one, Step_two, Step_three, Step_four } from "./steps";
import Steps_progressbar from "./components/Steps_progressbar";
import { Suspense } from "react";
import LoadingSpin from "../components/LoadingSpin";

let currentPage: null | string = null;

export default function Build_memori_gift_page({ searchParams }: { searchParams: { step: string; pack: string; cgid: string; catitmid: string } }) {
  const headersSet = headers();

  if (headersSet.get("referer") != null) {
    currentPage = `http://127.0.0.1:3000/build-a-memori_gift?step=${searchParams.step}`;
  } else {
    if (currentPage) {
      redirect(currentPage);
    }
  }

  return (
    <>
      <Steps_progressbar />
      <section className='steps_content_section'>
        {searchParams.step === "one" && (
          <Suspense fallback={<LoadingSpin />}>
            {/* @ts-ignore */}
            <Step_one />
          </Suspense>
        )}
        {searchParams.step === "two" && (
          // <Suspense fallback={<LoadingSpin />}>
          //@ts-ignore
          <Step_two searchParams={searchParams} />
          // </Suspense>
        )}
        {searchParams.step === "three" && (
          // @ts-ignore
          <Step_three searchParams={searchParams} />
        )}
        {searchParams.step === "four" && <Step_four />}
      </section>
    </>
  );
}
