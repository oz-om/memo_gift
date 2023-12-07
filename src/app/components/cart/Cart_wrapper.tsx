import Cart_item from "./Cart_item";
import Link from "next/link";
import { Close_cart } from "../client/Navbar";

export default function Cart_wrapper() {
  return (
    <div className='cart_content fixed top-0 bottom-0 z-10 bg-slate-50 text-black max-w-sm w-full -right-[100vw] transition-[right]'>
      <div className='cart_head flex items-center border-b '>
        <Close_cart />
        <h4 className='tracking-widest text-3xl text-slate-600 text-center mx-auto'>
          <span className='text-teal-400 inline-flex items-center'>
            <lord-icon src='https://cdn.lordicon.com/pgmktfgp.json' style={{ width: "40px", height: "40px" }} trigger='hover' colors='primary:#9cf4df,secondary:#848484'></lord-icon>
            <span>Your Cart</span>
          </span>
        </h4>
      </div>
      <div className='cart_items  overflow-y-auto h-[calc(100%_-_100px)] custom-scroll-bar'>
        <Cart_item name={"happy birthday"} quantity={1} totalPrice={120} includes={["/images/items_01.png", "/images/items_02.png", "/images/items_03.png", "/images/items_05.png", "/images/items_06.png"]} />
        <Cart_item name={"Hallowing Night"} quantity={1} totalPrice={200} includes={["/images/items_03.png", "/images/items_04.png"]} />
      </div>
      <div className='total_price_checkout absolute bottom-0 bg-sky-100 w-full flex justify-between p-2'>
        <div className='price'>
          <span className='text-xl'>Total Price:</span>
          <span className='text-xl ml-2'>$120</span>
        </div>
        <div className='checkout'>
          <Link href={"/checkout"} className='text-xl text-slate-600 text-center border border-sky-500 py-1 px-2 rounded-md'>
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
