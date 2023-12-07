import Link from "next/link";
import Address_form from "./components/Address_form";
import Order from "./components/Order";

export default function Checkout() {
  return (
    <>
      <section className='orders_wrapper'>
        <div className='container'>
          <div className='orders_list'>
            <Order name={"happy Birthday"} price={120} postCard={"/images/card_item_01.png"} includes={["/images/items_01.png", "/images/items_02.png"]} />
            <Order name={"congratulation"} price={112} postCard={"/images/card_item_03.png"} includes={["/images/items_03.png", "/images/items_04.png", "/images/items_05.png"]} />
            <Order name={"nice day with the best faces"} price={30} postCard={"/images/card_item_02.png"} includes={["/images/items_01.png"]} type={"item"} />
          </div>
          <div className='confirm_order flex flex-col items-end mt-5'>
            <div className='total_price flex items-center gap-x-4 mb-3'>
              <span>subtotal: </span>
              <p className='font-sans text-2xl'>120$</p>
            </div>
            <div className='confirm_checkout'>
              <Link href={"/checkout/shipping"}>
                <button className='uppercase px-8 py-2 text-teal-300 bg-slate-800 border border-teal-500 rounded-md hover:bg-slate-700'>complete order</button>
              </Link>
            </div>
          </div>
        </div>

        <Address_form />
      </section>
    </>
  );
}
