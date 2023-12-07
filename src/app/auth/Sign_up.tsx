import { Patrick_Hand } from "next/font/google";
import Image from "next/image";
import Auth_provider from "./components/Auth_provider";
import { Input, Submit } from "./components/Input";
import Link from "next/link";

const PatrickHand = Patrick_Hand({
  weight: ["400"],
  subsets: ["latin"],
});

async function formAction(formData: FormData) {
  "use server";
  console.log(formData);
}
export default function Sign_up() {
  return (
    <>
      <div className="signup_wrapper  bg-[url('/images/auth_bg_01.png')] bg-center bg-cover max-w-3xl lg:max-w-4xl w-full mx-auto rounded-md shadow-md overflow-hidden">
        <div className='signup flex backdrop-brightness-75 h-full'>
          <div className='left_side basis-1/2  place-content-center px-10 hidden min-[570px]:grid'>
            <div className='logo w-24 mx-auto'>
              <Image src={"/images/logo_test.png"} alt='test logo' width={200} height={200} />
            </div>
            <div className={"title " + PatrickHand.className}>
              <h4 className='text-3xl uppercase text-center font-semibold text-white [word-spacing:.3em] tracking-wider'>Join to us</h4>
            </div>
            <div className='desc text-white text-center text-sm mt-4'>
              <p>here we can help you to deepen your relationships and be more present in the lives of others</p>
            </div>
          </div>
          <div className='right_side w-full bg-white rounded  min-[570px]:basis-1/2  min-[570px]:m-1'>
            <h4 className='title flex items-center justify-center text-teal-600 my-5'>
              <i className='bx bx-sm bx-plug before:font-semibold'></i>
              <span className='text-2xl font-medium'>Sign up</span>
            </h4>
            <div className='external_auth'>
              <p className='text-xs text-slate-400 text-center mb-4'>connect with:</p>
              <ul className='auth_provider flex justify-center items-center gap-x-4'>
                <Auth_provider icon='bxl-google' bg={"bg-red-600"} />
                <Auth_provider icon='bxl-facebook' bg={"bg-blue-600"} />
                <Auth_provider icon='bxl-twitter' bg={"bg-blue-400"} />
              </ul>
            </div>
            <div className='or_line px-4 mt-4'>
              <p className="text-center text-slate-400 relative before:content-[''] before:absolute before:w-[45%] before:h-[1px] before:bg-slate-400 before:-translate-y-1/2 before:top-1/2 before:left-0 after:content-[''] after:absolute after:w-[45%] after:h-[1px] after:bg-slate-400 after:-translate-y-1/2 after:top-1/2 after:right-0">OR</p>
            </div>
            <form action={formAction} className='px-10'>
              <div className='username flex gap-x-4'>
                <Input name={"firstname"} className='basis-1/2' type={"text"} placeholder={"first Name"} />
                <Input name={"lastname"} className='basis-1/2' type={"text"} placeholder={"last Name"} />
              </div>
              <Input name={"username"} type={"text"} placeholder={"username"} />
              <Input name={"email"} type={"text"} placeholder={"email"} />
              <Input name={"password"} type={"password"} placeholder={"password"} />
              <Submit name={"register"} />
            </form>
            <div className='sign-up_redirect my-5'>
              <p className='text-center'>
                already have an account?{" "}
                <Link href={"?type=login"} className='text-teal-500'>
                  login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
