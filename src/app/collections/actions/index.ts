"use server";

import { prisma } from "@/lib/db/prisma";
import { T_data } from "../context/Filter_Context";
import delay from "@/utils/delay";
type T_getDataReturn = { success: true; data: T_data[] } | { success: false; error: string };
export type T_getData = () => Promise<T_getDataReturn>;

export async function getPremades(): Promise<T_getDataReturn> {
  await delay(2000);
  try {
    const premades = await prisma.premadeGift.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        images: true,
        price: true,
        categories: {
          select: {
            cat_name: true,
          },
        },
        variants: {
          select: {
            variant_id: true,
          },
        },
      },
    });
    return {
      success: true,
      data: premades,
    };
  } catch (error) {
    return {
      success: false,
      error: "something went wrong, please try again!",
    };
  }
}

export async function getItems(): Promise<T_getDataReturn> {
  await delay(2000);
  try {
    const items = await prisma.item.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        images: true,
        price: true,
        theme: true,
        categories: {
          select: {
            cat_name: true,
          },
        },
      },
    });
    return {
      success: true,
      data: items,
    };
  } catch (error) {
    return {
      success: false,
      error: "something went wrong, please try again!",
    };
  }
}
