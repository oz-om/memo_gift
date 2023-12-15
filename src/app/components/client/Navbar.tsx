"use client";

import { useUrlChanged } from "@/app/hooks/useUrlChanged";

function toggleMenu() {
  document.querySelector(".nave_menu")?.classList.toggle("w-0");
  document.querySelector(".nave_menu")?.classList.toggle("w-full");
}
function toggleCart() {
  document.querySelector(".basket .cart_content")?.classList.toggle("-right-[100vw]");
  document.querySelector(".basket .cart_content")?.classList.toggle("right-0");
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
    <div className='close_menu text-end' onClick={toggleMenu}>
      <i className='bx bx-x text-black text-3xl cursor-pointer'></i>
    </div>
  );
}

export function Open_cart() {
  return <i onClick={toggleCart} className='bx bxs-cart-alt text-teal-400 text-3xl font-extrabold cursor-pointer'></i>;
}

export function Close_cart() {
  useUrlChanged({
    eleClass: ".basket .cart_content",
    openClass: "right-0",
    resetFn: toggleCart,
  });
  return (
    <div onClick={toggleCart} className='close_icon flex items-center text-red-600'>
      <i className='bx bx-x text-3xl cursor-pointer bg-red-50'></i>
    </div>
  );
}
