import { Step_one, Step_two, Step_three, Step_four } from "./steps";
import Steps_progressbar from "./components/client/Steps_progressbar";
import { Suspense } from "react";
import LoadingSpin from "../components/LoadingSpin";

export default function Build_memori_gift_page({ searchParams }: { searchParams: { step: string; cgid: string; catitmid: string } }) {
  return (
    <>
      <Steps_progressbar />
      <section className='steps_content_section'>
        <Suspense fallback={<LoadingSpin />}>
          {searchParams.step === "one" && (
            /* @ts-ignore */
            <Step_one searchParams={searchParams} />
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
        </Suspense>
      </section>
    </>
  );
}
