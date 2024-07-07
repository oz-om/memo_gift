import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("invalid signature", { status: 400 });
  const body = await req.text();
  const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_KEY!);
  let chargeId;
  // to do:
  // check if event id is already existing in db if yes than return success its already purchased
  try {
    if (event.type === "charge.succeeded") {
      chargeId = event.data.object.id;
      const orderedItems: string[] = JSON.parse(event.data.object.metadata.cartItems);
      const receipt_email = event.data.object.receipt_email;

      // loop on all ordered cartItems and make a copy of each one as ordered cartItem
      await prisma.$transaction(async () => {
        const orderedProductsPromises = orderedItems.map(async (itemId) => {
          const orderedItem = await prisma.cartItem.findUnique({
            where: {
              id: itemId,
            },
            include: {
              customGift: {
                include: {
                  includes: true,
                },
              },
            },
          });
          if (!orderedItem) {
            console.log(`Ordered item with id ${itemId} not found`);
            throw new Error(`Ordered item with id ${itemId} not found`);
          }

          let orderedCustomGift: { id: string | null } = { id: null };

          // if ordered cartItem contains custom gift so we need to make a copy of that custom gift as an ordered custom gift
          if (orderedItem.custom_gift_id && orderedItem.customGift) {
            orderedCustomGift = await prisma.orderedCustomGift.create({
              data: {
                name: orderedItem.customGift.name,
                price: orderedItem.customGift.price,
                owner: orderedItem.customGift.owner,
              },
              select: {
                id: true,
              },
            });

            // copy all customGift includes to the ordered customGift the we created
            const includesPromises = orderedItem.customGift.includes.map((included) => {
              return prisma.orderedCustomGiftIncludes.create({
                data: {
                  orderedCustomGift_id: orderedCustomGift.id!,
                  item_id: included.item_id,
                  quantity: included.quantity,
                },
              });
            });
            await Promise.all(includesPromises);
          }

          // make a copy of the cart item as ordered product
          const orderedProduct = await prisma.orderedProduct.create({
            data: {
              premade_id: orderedItem.premade_id,
              ordered_customGift_id: orderedCustomGift.id,
              item_id: orderedItem.item_id,
              empty_card: orderedItem.empty_card,
              from: orderedItem.from,
              to: orderedItem.to,
              without_note: orderedItem.without_note,
              note: orderedItem.note,
              address: orderedItem.address,
              chosed_variant: orderedItem.chosed_variant,
              post_card: orderedItem.post_card,
              quantity: orderedItem.quantity,
            },
            include: {
              orderedCustomGift: true,
              premade: true,
              item: true,
            },
          });
          const createOrder = await prisma.order.create({
            data: {
              product_id: orderedProduct.id,
              email: receipt_email ?? "unknown",
              address: orderedProduct.address!,
              user_id: event.data.object.metadata.userId,
              order_status: "pending",
              payment_method: event.data.object.payment_method!,
              amount: orderedProduct.quantity * (orderedProduct.orderedCustomGift?.price ?? orderedProduct.premade?.price ?? orderedProduct.item?.price)!,
            },
          });
          await prisma.cartItem.delete({
            where: {
              id: itemId,
            },
          });
          return createOrder;
        });
        await Promise.all(orderedProductsPromises);
      });
      // to do:
      // save event id in db to prevent duplicated events event.id
      // send email notification to receipt email that his order created
    }
    return new Response("", { status: 200 });
  } catch (error) {
    console.log("error during saving order", error);
    await stripe.refunds.create({ charge: chargeId });
    return new NextResponse("failed, something went wrong during saving order", { status: 500 });
  }
}
