import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Variant from "../components/client/Variant";
import Step_intro from "../components/Step_intro";

export default async function Step_three({ searchParams }: { searchParams: { cgid: string; catitmid: string } }) {
  let { cgid, catitmid } = searchParams;
  if (!catitmid || !catitmid.trim().length) {
    redirect("/build-a-memori_gift?step=one&cgid=" + cgid);
  }
  let cartItem = await prisma.cartItem.findUnique({
    where: {
      id: catitmid,
    },
  });

  if (!cartItem) {
    redirect("/build-a-memori_gift?step=one&cgid=" + cgid);
  }

  const variants = await prisma.variant.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className='step_one_section'>
      <div className='container'>
        <Step_intro step='3' title='CHOOSE YOUR BOX COLOR' desc='we completely done, her we go chose your custom gift cover variant and make happiness every where' />
        <div className='step_one_content max-w-5xl mx-auto'>
          <div className='available_variants flex flex-col sm:flex-row justify-center'>
            {variants.map((variant) => {
              return <Variant key={variant.id} variant={variant} cartItemId={catitmid} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
