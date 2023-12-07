import Image from "next/image";
import Link from "next/link";
import Step_intro from "../components/Step_intro";

export default function Step_one() {
  return (
    <section className='step_one_section'>
      <div className='container'>
        <Step_intro step='1' title='CHOOSE YOUR BOX COLOR' desc='Welcome to the easiest way to send someone a custom gift, in 3 simple steps. Add to cart and repeat for multiple boxes, or update your quantity in the cart.' />
        <div className='step_one_content max-w-5xl mx-auto'>
          <div className='available_packs flex flex-col sm:flex-row justify-center'>
            <Link href={"?step=two&pack=one"}>
              <figure className='cursor-pointer'>
                <Image src={"/images/step-one-pack-one.png"} alt={"Original Creme"} width={713} height={556} />
                <figcaption className='text-center'>Original Creme</figcaption>
              </figure>
            </Link>
            <Link href={"?step=two&pack=two"}>
              <figure className='cursor-pointer'>
                <Image src={"/images/step-one-pack-two.png"} alt={"Matte black"} width={713} height={556} />
                <figcaption className='text-center'>Matte Black</figcaption>
              </figure>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
