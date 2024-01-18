import { prisma } from "@/lib/db/prisma";
import React from "react";
import { T_Address } from "./client/Order";

export default async function AddressesList({ userId, choseAddress, localAddresses }: { userId: string; localAddresses: T_Address[]; choseAddress: (a: string) => void }) {
  let availableAddresses: T_Address[] = [];
  if (userId) {
    availableAddresses = await prisma.address.findMany({
      where: {
        user_id: userId,
      },
      select: {
        id: true,
        user_id: true,
        address: true,
      },
    });
  } else {
    availableAddresses = localAddresses;
  }

  return (
    <>
      {availableAddresses.map((a, i) => {
        let address = a.address;
        return (
          <li key={i} onClick={() => choseAddress(address)} className=' py-2 px-4 cursor-pointer hover:bg-teal-50 text-xs'>
            {address}
          </li>
        );
      })}
    </>
  );
}
