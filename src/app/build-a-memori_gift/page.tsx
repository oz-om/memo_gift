import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Step_one, Step_two, Step_three, Step_four } from "./steps";
import Steps_progressbar from "./components/Steps_progressbar";

let currentPage: null | string = null;
export default function Build_memori_gift_page({ searchParams }: { searchParams: { step: string } }) {
  const headersSet = headers();
  // @ts-ignore
  if (headersSet.headers["referer"] != null) {
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
        {searchParams.step === "one" && <Step_one />}
        {searchParams.step === "two" && <Step_two />}
        {searchParams.step === "three" && <Step_three />}
        {searchParams.step === "four" && <Step_four />}
      </section>
    </>
  );
}
