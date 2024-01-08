"use server";

import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function controlCartItemQuantity(cartItemId: string, action: "increment" | "decrement") {
  try {
    await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity: {
          [action]: 1,
        },
      },
    });
    revalidatePath("");
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "something went wrong during " + action + " item quantity",
    };
  }
}

export async function deleteAction(cartItemId: string, cartItemType: string) {
  try {
    if (cartItemType === "customGift") {
      await prisma.customGift.delete({
        where: {
          id: cartItemId,
        },
      });
      revalidatePath("");
      return {
        delete: true,
      };
    }
    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });
    revalidatePath("");
    return {
      delete: true,
    };
  } catch (error) {
    return {
      delete: false,
    };
  }
}

// extract the cartItem to a new cartItem to set it as premade/customGift editable
type PremadeGift = Prisma.PremadeGiftGetPayload<{
  include: {
    includes: {
      include: {
        item: true;
      };
    };
  };
}>;
type CustomGift = Prisma.customGiftGetPayload<{
  include: {
    includes: {
      include: {
        item: true;
      };
    };
  };
}>;
type T_targetProductType = PremadeGift | CustomGift | null;

export async function editAction(productId: string, targetProductType: "premade" | "customGift"): Promise<{ success: true; cgid: string } | { success: false; error: string }> {
  let targetProduct: T_targetProductType = null;
  try {
    // get the target product
    if (targetProductType == "premade") {
      targetProduct = await prisma.premadeGift.findUnique({
        where: {
          id: productId,
        },
        include: {
          includes: {
            include: {
              item: true,
            },
          },
        },
      });
    } else {
      targetProduct = await prisma.customGift.findUnique({
        where: {
          id: productId,
        },
        include: {
          includes: {
            include: {
              item: true,
            },
          },
        },
      });
    }
    // if can't fine the target product for any reason
    if (!targetProduct) {
      return {
        success: false,
        error: "can't edit the target item",
      };
    }

    // create new custom gift
    let newCustomGift = await prisma.customGift.create({
      data: {
        price: targetProduct.price,
        name: "custom gift",
      },
    });
    //  extract target product includes to the new created custom gift
    targetProduct.includes.forEach(async (include) => {
      let data = {
        customGift_id: newCustomGift.id,
        item_id: include.item.id,
        quantity: 1,
      };
      if (targetProductType == "customGift" && "customGift_id" in include) {
        data.quantity = include.quantity;
      }
      await prisma.customGiftIncudes.create({ data });
    });

    cookies().set("customGiftId", newCustomGift.id);
    return {
      success: true,
      cgid: newCustomGift.id,
    };
  } catch (error) {
    return {
      success: false,
      error: "Oops! Something went wrong, please try again",
    };
  }
}

export async function duplicate(cartItemId: string): Promise<{ success: true } | { success: false; error: string }> {
  console.log(cartItemId);
  if (!cartItemId) {
    return {
      success: false,
      error: "Something went wrong, please try again",
    };
  }
  let targetCartItem = await prisma.cartItem.findUnique({
    where: {
      id: cartItemId,
    },
  });
  if (!targetCartItem) {
    return {
      success: false,
      error: "Couldn't find cart item",
    };
  }
  let anonymousUser = cookies().get("anonymousUserId")?.value;

  if (!anonymousUser) {
    anonymousUser = crypto.randomUUID();
    cookies().set("anonymousUserId", anonymousUser);
  }

  let { createdAt, updatedAt, id, ...copyCartItem } = targetCartItem;
  let isCustomGift = copyCartItem.custom_gift_id;
  if (isCustomGift) {
    let customGift = await prisma.customGift.findUnique({
      where: {
        id: isCustomGift,
      },
      include: {
        includes: true,
      },
    });
    let copiedCustomGift = await prisma.customGift.create({
      data: {
        name: customGift?.name,
        price: customGift?.price,
      },
    });
    customGift?.includes.map(async (include) => {
      await prisma.customGiftIncudes.create({
        data: {
          customGift_id: copiedCustomGift.id,
          item_id: include.item_id,
          quantity: include.quantity,
        },
      });
    });
    isCustomGift = copiedCustomGift.id;
  }

  let duplicatedCartItem = await prisma.cartItem.create({
    data: {
      ...copyCartItem,
      custom_gift_id: isCustomGift,
    },
  });
  await prisma.cart.create({
    data: {
      anonymous_user: anonymousUser,
      cart_item: duplicatedCartItem.id,
    },
  });
  revalidatePath("");
  return {
    success: true,
  };
}
