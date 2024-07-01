"use client";
import { Prisma } from "@prisma/client";
import React, { useState } from "react";
import Order from "./Order";
import dynamic from "next/dynamic";
import { submitAddressAction } from "@/app/action";
import Lazy_Loading_Spin from "@/app/components/Lazy_Loading_Spin";
const Address_form = dynamic(() => import("@/app/components/client/Address_form"), {
  loading: () => <Lazy_Loading_Spin />,
});

type T_Orders = Prisma.CartGetPayload<{
  include: {
    cartItem: {
      include: {
        customGift: {
          include: {
            includes: {
              select: {
                quantity: true;
              };
              include: {
                item: true;
              };
            };
          };
        };
        premade: {
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
    user: {
      select: {
        address: {
          select: {
            user_id: true;
            address: true;
            id: true;
          };
        };
      };
    };
  };
}>[];

export default function OrdersList({ Orders, userId }: { Orders: T_Orders; userId: string | null }) {
  const [openAddressForm, setOpenAddressForm] = useState(false);
  return (
    <>
      <div className='orders_list'>
        {Orders.map(({ cartItem, user }) => {
          return <Order key={cartItem.id} cartItem={cartItem} addresses={user?.address ?? []} openAddressForm={setOpenAddressForm} />;
        })}
      </div>
      {openAddressForm && <Address_form userId={userId} addressData={undefined} submitAddressAction={submitAddressAction} submitType='create' isOpen={openAddressForm} setIsOpen={setOpenAddressForm} />}
    </>
  );
}
