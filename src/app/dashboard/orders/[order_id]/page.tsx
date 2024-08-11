import React, { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { timeDetails } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { SetAsRejected, SetAsShipped } from "./components/orderControls";

type T_Order = Prisma.OrderGetPayload<{
  include: {
    product: {
      include: {
        premade: {
          include: {
            includes: {
              include: {
                item: true;
              };
            };
          };
        };
        orderedCustomGift: {
          include: {
            includes: {
              include: {
                item: true;
              };
            };
          };
        };
        item: true;
        variant: true;
        postcard: true;
      };
    };
    user: true;
  };
}> | null;

const getOrder = cache(async (id: number) => {
  let order: T_Order = null;
  order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      product: {
        include: {
          premade: {
            include: {
              includes: {
                include: {
                  item: true,
                },
              },
            },
          },
          orderedCustomGift: {
            include: {
              includes: {
                include: {
                  item: true,
                },
              },
            },
          },
          item: true,
          variant: true,
          postcard: true,
        },
      },
      user: true,
    },
  });
  if (!order) return notFound();
  return order;
});

export async function generateMetadata({ params: { order_id } }: { params: { order_id: string } }): Promise<Metadata> {
  const order = await getOrder(+order_id);
  let productThatInOrder = order.product.premade ?? order.product.orderedCustomGift ?? order.product.item;
  return {
    title: (productThatInOrder?.name ?? "custom gift") + " - Order - Dashboard",
  };
}

export default async function ManageOrderPage({ params }: { params: { order_id: string } }) {
  let order = await getOrder(+params.order_id);
  const product = order.product;
  const { hours, minutes, day } = timeDetails(order.createdAt);
  const withIncludes = product.orderedCustomGift ?? product.premade;
  let orderOwner = order.user;
  return (
    <>
      <h4 className='border-b'>order details:</h4>
      <section className='order_details_section'>
        <div className='order_details_wrapper'>
          <div className='order sm:flex justify-around gap-4'>
            <div className='order_details'>
              <div className='order_status flex gap-4 justify-between flex-wrap items-center border-b py-3'>
                <div className='order_type flex gap-x-4 items-center '>
                  <h4>type: </h4>
                  <span className={"px-2 rounded text-white " + (!!product.premade ? "bg-teal-400" : !!product.orderedCustomGift ? "bg-blue-400" : "bg-orange-400")}>{product.orderedCustomGift ? "custom gift" : product.premade ? "premade" : "single item"}</span>
                </div>
                <div className='ordered_at_time text-slate-400 text-sm'>
                  {day} at {hours}:{minutes}
                </div>
                <div className={"order_status grow "}>
                  <p>
                    <span>status: </span>
                    <span className={"text-white rounded px-2 ml-2 " + (order.order_status == "pending" ? "bg-orange-400" : order.order_status == "rejected" ? "bg-red-400" : "bg-teal-400")}>{order.order_status}</span>
                  </p>
                </div>
              </div>
              <div className='order_contains mt-5'>
                <h4>{!!withIncludes ? "includes: " : "item:"}</h4>
                {!!withIncludes ? (
                  <div className='includes flex gap-4 bg-white px-2 py-3 rounded-md shadow'>
                    {withIncludes.includes.map((include) => {
                      let quantity: number = 1;
                      if ("orderedCustomGift_id" in include) {
                        quantity = include.quantity;
                      }
                      return (
                        <div key={include.item_id} className='item flex flex-col border rounded p-2 flex-1'>
                          <figure className='item_image overflow-hidden rounded relative'>
                            {quantity >= 1 && <span className='include_item_quantity absolute top-0 left-0 text-[10px] w-4 h-4 pt-[1px] grid place-content-center font-semibold border border-teal-50 bg-teal-500 text-teal-50 rounded-full '>{quantity}</span>}
                            <Image src={`${JSON.parse(include.item!.images)[0]}`} alt={"item image"} width={220} height={220} className='aspect-square' />
                          </figure>
                          <div className='item_name text-sm'>{include.item?.name}</div>
                          <div className='view mt-auto'>
                            <Link href={"/dashboard/products/item/" + include.item_id} className='bg-blue-400 text-white rounded px-2 flex items-center w-fit'>
                              <span>view</span> <i className='bx bx-arrow-back bx-flip-horizontal'></i>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className='item bg-white px-2 py-3 rounded-md shadow'>
                    <figure className='item_image max-w-xs overflow-hidden border rounded'>
                      <Image src={`${JSON.parse(product.item!.images)[0]}`} alt={"item image"} width={300} height={300} />
                    </figure>
                    <div className='item_name'>{product.item?.name}</div>
                    <div className='view'>
                      <Link href={"/dashboard/products/item/" + product.item?.id} className='bg-orange-400 text-white rounded px-2 flex items-center w-fit'>
                        <span>view</span> <i className='bx bx-arrow-back bx-flip-horizontal'></i>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              {product.variant && (
                <div className='variant flex mt-5'>
                  <h4>chosed variant: </h4>
                  <p className={"px-2 py1 rounded ml-4 "} style={{ backgroundColor: product.variant.value }}>
                    {product.variant.name}
                  </p>
                </div>
              )}
              <div className='quantity flex gap-4 items-center mt-5'>
                <h4>quantity:</h4>
                <p className='border rounded px-2 py1'>{product.quantity}</p>
              </div>
              <div className='order_postcard my-2'>
                <h4>post card:</h4>
                <div className='post_card_info flex gap-2'>
                  <div className='postcard_preview'>
                    {product.postcard ? (
                      <Image src={product.postcard.image} alt={product.postcard.name} width={240} height={240} className='aspect-square border rounded' />
                    ) : (
                      <p className='text-sm p-2 border rounded grid place-content-center h-full'>
                        <span>no post card chosed</span>
                      </p>
                    )}
                  </div>
                  {!product.empty_card ? (
                    <div className='postcard_details flex flex-col gap-2'>
                      <div className='recipient_sender flex justify-between gap-x-3'>
                        <p className='flex flex-col'>
                          <span className='text-sm'>from:</span>
                          <span className='font-medium px-1 bg-slate-100 rounded'>{product.from}</span>
                        </p>
                        <p className='flex flex-col'>
                          <span className='text-sm'>to:</span>
                          <span className='font-medium px-1 bg-slate-100 rounded'>{product.to}</span>
                        </p>
                      </div>
                      {!product.without_note && (
                        <p className='flex flex-col'>
                          <span>note:</span>
                          <span className='font-medium px-1 bg-slate-100 rounded'>{product.note}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className='text-sm p-2 border rounded grid place-content-center h-full'>
                      <span>no post card details</span>
                    </p>
                  )}
                </div>
              </div>
              <div className='address'>
                <h4>address: </h4>
                <p className='border rounded px-2 py1 bg-slate-200'>{product.address?.split("<*>").join(" ")}</p>
              </div>
            </div>
            <div className='order_owner bg-white rounded shadow mt-3 p-2'>
              <h4>order owner info: </h4>
              <div className='info'>
                <div className='flex items-center gap-4'>
                  <figure className='w-20 h-20 rounded-full overflow-hidden border'>
                    <Image src={orderOwner ? `${orderOwner.profile_pic}` : "https://omzid.serv00.net/images/default.png"} alt={"user pic"} width={80} height={80} className='h-full' />
                  </figure>
                  <div className='user_details'>
                    <div className='user_full_name flex items-center gap-4'>
                      <h4>user: </h4>
                      <p className='border rounded px-2 py1'>{orderOwner ? `${orderOwner.first_name} ${orderOwner.last_name}` : "anonymous user"}</p>
                    </div>
                    <div className='user_name  flex items-center gap-4'>
                      <h4>username: </h4>
                      <p className='border rounded px-2 py1'>{orderOwner ? `${orderOwner.username}` : "anonymous user"}</p>
                    </div>
                  </div>
                </div>
                <div className='user_email flex gap-4 items-center mt-3'>
                  <h4>email: </h4>
                  <p className='border rounded px-2 py1'>{order.email}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='order_controls flex text-white flex-wrap justify-end gap-4 my-5'>
            {order.order_status !== "shipped" && order.order_status !== "rejected" ? (
              <>
                <SetAsShipped orderId={order.id} />
                <SetAsRejected orderId={order.id} />
              </>
            ) : (
              <p className='bg-slate-600 text-teal-300 px-2 py-1 rounded '>{order.order_status}</p>
            )}
            <div className='contact_with_owner'>
              <div className='report bg-orange-400 px-2 py-1 rounded cursor-pointer'>report order owner</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
