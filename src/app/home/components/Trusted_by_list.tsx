"use client";
import Image from "next/image";
import Swipe from "./Auto_swipe";

export default function Trusted_by_list() {
  return (
    <Swipe duration={20000}>
      <div className='trusted_by_item'>
        <Image src={"/images/visa.png"} alt='visa' width={300} height={240} />
      </div>
      <div className='trusted_by_item'>
        <Image src={"/images/amazon.png"} alt='amazon' width={300} height={240} />
      </div>
      <div className='trusted_by_item'>
        <Image src={"/images/google.png"} alt='google' width={300} height={240} />
      </div>
      <div className='trusted_by_item'>
        <Image src={"/images/pinterest.png"} alt='pinterest' width={300} height={240} />
      </div>
      <div className='trusted_by_item0'>
        <Image src={"/images/slack.png"} alt='slack' width={300} height={240} />
      </div>
      <div className='trusted_by_item'>
        <Image src={"/images/nespresso.png"} alt='nespresso' width={300} height={240} />
      </div>
      <div className='trusted_by_item'>
        <Image src={"/images/adobe.png"} alt='adobe' width={300} height={240} />
      </div>
    </Swipe>
  );
}
