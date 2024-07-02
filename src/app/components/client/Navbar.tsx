"use client";

import { useUrlChanged } from "@/hooks/useUrlChanged";
import { authUser } from "@/types/nextAuthTypes";
import { toastStyles } from "@/utils";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { useCartContent } from "../cart/context/CartCtProvider";
import { getCartContent } from "../cart/actions";

function toggleMenu() {
  document.querySelector(".nave_menu")?.classList.toggle("w-0");
  document.querySelector(".nave_menu")?.classList.toggle("w-full");
}

export function Open_menu() {
  return <i onClick={toggleMenu} className='bx bx-menu-alt-left text-teal-400 text-3xl font-extrabold cursor-pointer'></i>;
}

export function Close_menu() {
  useUrlChanged({
    eleClass: ".nave_menu",
    openClass: "w-full",
    resetFn: toggleMenu,
  });
  return (
    <div className='close_menu text-end ml-auto' onClick={toggleMenu}>
      <i className='bx bx-x text-black text-3xl cursor-pointer'></i>
    </div>
  );
}

function toggleCart(open: string, close: string) {
  document.querySelector(".basket .cart_content")?.classList.add(open);
  document.querySelector(".basket .cart_content")?.classList.remove(close);
}
export function Open_cart() {
  const { cart, setCartContent, setLoading } = useCartContent();
  async function handelOpenCart() {
    if (cart.length == 0) {
      const alert = toast;
      setLoading(true);
      try {
        getCartContent()
          .then((cartContent) => {
            if (cartContent.success) {
              setCartContent(cartContent.cart);
            } else {
              alert.error(cartContent.error, { style: toastStyles });
            }
          })
          .finally(() => setLoading(false));
      } catch (error) {
        alert.error("ops something went wrong, please try again!", { style: toastStyles });
        setLoading(false);
      }
    }
    toggleCart("right-0", "-right-[100vw]");
  }
  return <i onClick={handelOpenCart} className='bx bxs-cart-alt text-teal-400 text-3xl font-extrabold cursor-pointer'></i>;
}

export function Close_cart() {
  useUrlChanged({
    eleClass: ".basket .cart_content",
    openClass: "right-0",
    resetFn: handelToggle,
  });

  function handelToggle() {
    toggleCart("-right-[100vw]", "right-0");
  }
  return (
    <div onClick={handelToggle} className='close_icon flex items-center text-red-600'>
      <i className='bx bx-x text-3xl cursor-pointer bg-red-50'></i>
    </div>
  );
}

export function AccountIcon({ user }: { user: authUser }) {
  let accountMenu = useRef<HTMLDivElement | null>(null);

  function toggleAccountMenu() {
    if (accountMenu.current) {
      accountMenu.current.classList.toggle("hidden");
      document.body.classList.toggle("overflow-hidden");
      document.body.classList.toggle("sm:overflow-auto");
      document.body.classList.toggle("mr-4");
    }
  }

  return (
    <>
      <figure className=' w-7 h-7 rounded-full border border-teal-100 overflow-hidden cursor-pointer'>
        <Image onClick={toggleAccountMenu} src={`${user.profile_pic}`} className='w-full h-full object-cover' alt='user profile' width={100} height={100} />
      </figure>

      <div ref={accountMenu} onClick={toggleAccountMenu} className='overlay fixed top-0 left-0 w-full h-full z-10 bg-slate-900/15 overscroll-contain hidden'>
        <ul className='account_options absolute w-full h-full max-w-60 right-0 bg-white text-black z-10  px-2 py-1 rounded border shadow '>
          <li className='flex items-center justify-between mb-4 border-b py-2'>
            <div className='flex items-center gap-x-4'>
              <figure className='w-7 h-7 rounded-full overflow-hidden border'>
                <Image src={`${user.profile_pic}`} alt='user profile' width={50} height={50} />
              </figure>
              <p>{user.username}</p>
            </div>
            <i className='bx bx-x bx-border bx-sm cursor-pointer'></i>
          </li>
          <li>
            <Link href={"/profile"} className='flex gap-x-2 items-center p-1 mb-1 border rounded capitalize hover:bg-slate-200'>
              <i className='bx bxs-user-circle'></i>
              <span> profile</span>
            </Link>
          </li>
          <li>
            <Link href={"/profile/orders"} className='flex gap-x-2 items-center p-1 mb-1 border rounded capitalize hover:bg-slate-200'>
              <i className='bx bx-store'></i>
              <span>orders</span>
            </Link>
          </li>
          {user.role == "admin" ? (
            <li>
              <Link href={"/dashboard"} className='flex gap-x-2 items-center p-1 mb-1 border rounded capitalize hover:bg-slate-200'>
                <i className='bx bx-store'></i>
                <span>dashboard</span>
              </Link>
            </li>
          ) : null}
          <LogOut className='flex gap-x-2 items-center p-1 mb-1 border rounded capitalize text-red-400 cursor-pointer hover:bg-slate-200' />
        </ul>
      </div>
    </>
  );
}

export function LogOut({ className, iconStyle }: { className?: string; iconStyle?: string }) {
  const router = useRouter();
  async function handelSignOut() {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/sign-in",
      });
      router.refresh();
    } catch (error) {
      toast.error("something went wrong", {
        position: "top-right",
        style: {
          backgroundColor: "#ffe6e6",
          padding: "1px 2px",
          fontSize: "12px",
        },
      });
    }
  }
  return (
    <li onClick={handelSignOut} className={className}>
      <i className={"bx bx-log-out-circle " + iconStyle}></i>
      <span>log-out</span>
    </li>
  );
}
