import "./styles/style.css";
import Sign_up from "./Sign_up";
import Login from "./Login";
import { redirect } from "next/navigation";

export default function Authentication({ searchParams: { type } }: { searchParams: { type: string } }) {
  if (!type || (type !== "login" && type !== "sign-up")) {
    redirect("/");
  }

  return (
    <main className='auth'>
      <div className='container'>
        {type == "login" && <Login />}
        {type == "sign-up" && <Sign_up />}
      </div>
    </main>
  );
}
