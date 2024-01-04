import Card_item, { RemovePostCard } from "@/app/components/client/card_item";
import { prisma } from "@/lib/db/prisma";

export default async function PostCardsList() {
  let postCards = await prisma.postCard.findMany();
  return (
    <div className='cards_list grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-10'>
      <RemovePostCard called='customGift' />
      {postCards.map((postcard) => {
        return <Card_item key={postcard.id} id={postcard.id} called='customGift' image={postcard.image} name={postcard.name} />;
      })}
    </div>
  );
}
