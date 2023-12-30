import { prisma } from "@/lib/db/prisma";
import Variant from "../components/client/Variant";
import Step_intro from "../components/Step_intro";

export default async function Step_one() {
  const variants = await prisma.variant.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className='step_one_section'>
      <div className='container'>
        <Step_intro step='1' title='CHOOSE YOUR BOX COLOR' desc='Welcome to the easiest way to send someone a custom gift, in 3 simple steps. Add to cart and repeat for multiple boxes, or update your quantity in the cart.' />
        <div className='step_one_content max-w-5xl mx-auto'>
          <div className='available_variants flex flex-col sm:flex-row justify-center'>
            {variants.map((variant) => {
              return <Variant key={variant.id} variant={variant} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
