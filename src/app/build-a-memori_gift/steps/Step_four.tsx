import Step_intro from "../components/Step_intro";
import Congratulation from "../components/client/Congratulation";

export default function Step_four() {
  return (
    <section className='step_four_section'>
      <div className='container'>
        <Step_intro step='4' title='congratulation' desc='we are done!' />
      </div>
      <div className='step_four_wrapper grid place-content-center'>
        <h4 className='text-teal-400 text-2xl w-fit py-1 px-3 border border-teal-400 rounded capitalize'>your box was created!</h4>
        <p className='text-center text-sm'>go to cart to checkout</p>
      </div>
      <Congratulation />
    </section>
  );
}
