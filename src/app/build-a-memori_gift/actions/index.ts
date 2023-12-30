"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { boolean } from "zod";

async function getCustomGift(boxId: string) {
  let builtBox = await prisma.customGift.findUnique({
    where: {
      id: boxId,
    },
    include: {
      includes: {
        include: {
          item: true,
        },
      },
    },
  });
  return builtBox;
}
async function customGiftUpdatePrice(boxId: string, price: number) {
  await prisma.customGift.update({
    where: {
      id: boxId,
    },
    data: {
      price: price,
    },
  });
}

export async function createCustomGift(variantId: string): Promise<{
  create: boolean;
  customGiftId: string | null;
  error?: string;
}> {
  let existingCustomGiftId = cookies().get("customGiftId")?.value;
  if (existingCustomGiftId) {
    try {
      await prisma.customGift.update({
        where: {
          id: existingCustomGiftId,
        },
        data: {
          variant_id: variantId,
        },
      });
      return {
        create: true,
        customGiftId: existingCustomGiftId,
      };
    } catch (error) {
      return {
        create: false,
        customGiftId: null,
        error: "something went wrong with updating a variant for current custom gift, please try again",
      };
    }
  }
  try {
    let customGift = await prisma.customGift.create({
      data: {
        variant_id: variantId,
      },
      select: {
        id: true,
      },
    });
    cookies().set("customGiftId", customGift.id);
    return {
      create: true,
      customGiftId: customGift.id,
    };
  } catch (error) {
    return {
      create: false,
      customGiftId: null,
      error: "something went wrong during creating new box",
    };
  }
}

// add new item to custom gift includes
export async function addItemToCustomGift(itemId: string): Promise<{
  add: boolean;
  error?: string;
}> {
  let customGiftId = cookies().get("customGiftId")?.value;
  // if customGiftId removed from client
  if (!customGiftId) {
    return {
      add: false,
      error: "can't find the chosen box, please try again",
    };
  }

  let customGift = await getCustomGift(customGiftId);
  // if custom gift removed from db for any reason
  if (!customGift) {
    return {
      add: false,
      error: "there is no custom gift found to add this item to it",
    };
  }
  // get the added item price for add it to custom Gift price
  let addedItem = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
    select: {
      price: true,
    },
  });
  // if we can't find the added item for any reason
  if (!addedItem) {
    return {
      add: false,
      error: "there is a problem with adding this item, please try again",
    };
  }

  let items = customGift.includes.map((include) => include.item_id);
  if (!items.includes(itemId)) {
    // if item doesn't exist yet in custom gift includes so we need to add it as new item
    try {
      await prisma.customGiftIncudes.create({
        data: {
          customGift_id: customGift.id,
          item_id: itemId,
        },
      });
      // calc new price
      let currentPrice = customGift.price;
      let totalPrice = currentPrice + addedItem.price;
      await customGiftUpdatePrice(customGiftId, totalPrice);

      revalidatePath("");
      return {
        add: true,
      };
    } catch (error) {
      return {
        add: false,
        error: "something went wrong during adding this item",
      };
    }
  }

  try {
    // if item already exists in custom gift includes se we just update quantity
    await prisma.customGiftIncudes.update({
      where: {
        customGift_id_item_id: {
          customGift_id: customGift.id,
          item_id: itemId,
        },
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
    });
    // calc new price
    let currentPrice = customGift.price;
    let totalPrice = currentPrice + addedItem.price;
    await customGiftUpdatePrice(customGiftId, totalPrice);

    revalidatePath("");
    return {
      add: true,
    };
  } catch (error) {
    return {
      add: false,
      error: "something went wrong during increment quantity of this item",
    };
  }
}

// control the quantity during increment|decrement
export async function controlQuantity(
  boxId: string,
  itemId: string,
  action: "increment" | "decrement",
): Promise<{
  success: boolean;
  error?: string;
}> {
  // check quantity before action
  let item = await prisma.customGiftIncudes.findUnique({
    where: {
      customGift_id_item_id: {
        customGift_id: boxId,
        item_id: itemId,
      },
    },
    select: {
      quantity: true,
    },
  });
  if (item && item?.quantity < 1) {
    return {
      success: true,
    };
  }
  // apply changes
  try {
    await prisma.customGiftIncudes.update({
      where: {
        customGift_id_item_id: {
          customGift_id: boxId,
          item_id: itemId,
        },
      },
      data: {
        quantity: {
          [action]: 1,
        },
      },
    });
    // get all includes to calc total price
    let customGift = await getCustomGift(boxId);
    if (!customGift) {
      return {
        success: false,
        error: "something went wrong during " + action + " this item quantity",
      };
    }
    let includes = customGift.includes;
    // calc total price
    let totalPrice = includes.reduce((total, include) => (total += include.item.price * include.quantity), 0);
    // update total price
    await customGiftUpdatePrice(boxId, totalPrice);
    revalidatePath("");
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "something went wrong during " + action + " this item quantity",
    };
  }
}

// remove chosed item form custom gifts includes
export async function removeItem(
  itemId: string,
  boxId: string,
): Promise<{
  deleted: boolean;
  error?: string;
}> {
  try {
    let customGift = await getCustomGift(boxId);
    if (!customGift) {
      return {
        deleted: false,
        error: "Something went wrong during delete operation ",
      };
    }
    // get all includes to increase the deleted item price
    let includes = customGift.includes;
    // get current price
    let totalPrice = customGift.price;
    // get index of item and increment its price form total price
    let itemIndex = includes.findIndex((item) => item.item.id === itemId);
    let removedItemPrice = includes[itemIndex].item.price * includes[itemIndex].quantity;
    totalPrice -= removedItemPrice;

    // update price in customGift
    await customGiftUpdatePrice(boxId, totalPrice);

    // deleting the item
    await prisma.customGiftIncudes.delete({
      where: {
        customGift_id_item_id: {
          customGift_id: boxId,
          item_id: itemId,
        },
      },
    });
    revalidatePath("");
    return {
      deleted: true,
    };
  } catch (error) {
    return {
      deleted: false,
      error: "Something went wrong during delete operation ",
    };
  }
}

export async function setCustomGiftIntoCartItem(): Promise<{
  success: boolean;
  cartItemId: string | null;
  error?: string;
}> {
  let cartItemId = cookies().get("cartItemId")?.value;
  try {
    if (!cartItemId) {
      let newCartItemId = await prisma.cartItem.create({
        data: {},
      });
      cookies().set("cartItemId", newCartItemId.id);
      return {
        success: true,
        cartItemId: newCartItemId.id,
      };
    }
    return {
      success: true,
      cartItemId,
    };
  } catch (error) {
    return {
      success: false,
      cartItemId: null,
      error: "something went wrong during get next step",
    };
  }
}

// setup post card
export async function setPostCard(
  cartItemId: string,
  postCardId: string | null,
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!postCardId) {
      await prisma.cartItem.update({
        where: {
          id: cartItemId,
        },
        data: {
          post_card: null,
        },
      });
      revalidatePath("");
      return { success: true };
    }
    await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        post_card: postCardId,
      },
    });
    revalidatePath("");
    return { success: true };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "something went wrong during setting the Postcard",
    };
  }
}

// set Friendly not / message
export async function setFriendlyMessageAndAddCartItemToCart(
  customGiftId: string,
  cartItemId: string,
  emptyCard: boolean,
  withNote: boolean,
  data: FormData,
): Promise<{
  success: boolean;
  error?: string;
}> {
  let friendlyNoteData = {
    from: data.get("from") as string,
    to: data.get("to") as string,
    note: data.get("note") as string,
    with_note: true,
    empty_card: false,
  };
  if (emptyCard) {
    friendlyNoteData = {
      from: "",
      to: "",
      note: "",
      with_note: false,
      empty_card: true,
    };
  }
  if (!withNote) {
    friendlyNoteData = {
      ...friendlyNoteData,
      note: "",
      with_note: false,
      empty_card: false,
    };
  }

  try {
    let cartItem = await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        ...friendlyNoteData,
        custom_gift_id: customGiftId,
      },
    });

    let anonymousUser = cookies().get("anonymousUser")?.value;
    let newAnonymousUser;
    if (!anonymousUser) {
      newAnonymousUser = crypto.randomUUID();
      cookies().set("anonymousUser", newAnonymousUser);
    }
    await prisma.cart.create({
      data: {
        cart_item: cartItem.id,
        anonymous_user: anonymousUser ?? newAnonymousUser,
      },
    });
    cookies().delete("customGiftId");
    cookies().delete("cartItemId");
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "something went wrong during submitting your request",
    };
  }
}
