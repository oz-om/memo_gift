import Image from "next/image";

type cartItemProps = {
  includes: string[];
  name: string;
  quantity: number;
  totalPrice: number;
};
export default function Cart_item({ includes, name, quantity, totalPrice }: cartItemProps) {
  return (
    <div className='cart_item bg-white odd:my-4 p-4 mx-1 rounded-md'>
      <div className='box_name flex justify-between px-4'>
        <h4 className='line-clamp-2'>{name}</h4>
        <div className='price'>
          <span className='font-sans'>{totalPrice}$</span>
        </div>
      </div>
      <div className='includes_items whitespace-nowrap overflow-x-auto my-2 custom-scroll-bar'>
        {includes.map((img, i) => {
          return (
            <figure key={i} className='w-20 h-20 inline-block mr-1 align-middle rounded-lg overflow-hidden'>
              <Image src={img} alt={""} width={900} height={900} />
            </figure>
          );
        })}
      </div>
      <div className='box_actions flex justify-between px-4'>
        <div className='box_quantity flex items-center gap-x-3'>
          <i className='bx bx-plus border grid place-content-center h-5 rounded-md font-bold cursor-pointer  hover:border-slate-700'></i>
          <span className='chosed_item_quantity text-center text-xl'>{quantity}</span>
          <i className='bx bx-minus border grid place-content-center h-5 rounded-md font-bold cursor-pointer hover:border-slate-700'></i>
        </div>
        <div className='edit_box flex gap-x-2 text-sm'>
          <div className='edit px-4 grid place-content-center rounded-md border border-teal-400 text-teal-400 cursor-pointer hover:bg-teal-50'>
            <>edit</>
          </div>
          <div className='delete px-4 grid place-content-center rounded-md text-red-400 cursor-pointer hover:bg-red-50'>
            <>delete</>
          </div>
        </div>
      </div>
    </div>
  );
}
