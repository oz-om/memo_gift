import Cart_item from "./Cart_item";
import Link from "next/link";
import { Close_cart, Open_cart } from "../client/Navbar";
import { useCartContent } from "./context/CartCtProvider";

export default function Cart_wrapper() {
  const { cart } = useCartContent();
  const totalPrice = cart.reduce((acc, { cartItem }) => {
    let { premade, customGift, item } = cartItem;
    let product = premade || customGift || item;
    let price = product?.price as number;
    return +(acc += price * cartItem.quantity).toFixed(2);
  }, 0);
  return (
    <>
      <Open_cart />
      <div className='cart_content fixed top-0 bottom-0 z-10 bg-slate-50 text-black max-w-sm w-full transition-[right] -right-[100vw]'>
        <div className='cart_head flex items-center border-b '>
          <Close_cart />
          <h4 className='tracking-widest text-3xl text-slate-600 text-center mx-auto'>
            <span className='text-teal-400 inline-flex items-center'>
              <lord-icon src='https://cdn.lordicon.com/pgmktfgp.json' style={{ width: "40px", height: "40px" }} trigger='hover' colors='primary:#9cf4df,secondary:#848484'></lord-icon>
              <span>Your Cart</span>
            </span>
          </h4>
        </div>
        <div className='cart_content_wrapper'>
          {/* @ts-ignore */}
          <div className='cart_items  overflow-y-auto h-[calc(100%_-_100px)] custom-scroll-bar overscroll-contain'>
            {cart.map(({ cartItem }) => {
              return <Cart_item key={cartItem.id} cartItem={cartItem} />;
            })}
            {!cart.length && (
              <div className='h-[50vh] grid place-content-center'>
                <p className='text-center text-slate-500'>empty</p>
              </div>
            )}
          </div>
          <div className='total_price_checkout absolute bottom-0 bg-sky-100 w-full flex justify-between p-2'>
            <div className='price'>
              <span className='text-xl'>Total Price:</span>
              <span className='text-xl ml-2'>${totalPrice}</span>
            </div>
            <div className='checkout'>
              <Link href={"/checkout"} className='text-xl text-slate-600 text-center border border-sky-500 py-1 px-2 rounded-md'>
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
