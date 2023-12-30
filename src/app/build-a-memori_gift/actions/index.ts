"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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
      postCard: true,
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

export async function createBuiltBox(variantId: string): Promise<{
  create: boolean;
  boxId: string | null;
  error?: string;
}> {
  let existingBoxId = cookies().get("builtBoxId")?.value;
  if (existingBoxId) {
    try {
      await prisma.customGift.update({
        where: {
          id: existingBoxId,
        },
        data: {
          variant_id: variantId,
        },
      });
      return {
        create: true,
        boxId: existingBoxId,
      };
    } catch (error) {
      return {
        create: false,
        boxId: null,
        error: "something went wrong with updating a variant for current custom gift, please try again",
      };
    }
  }
  try {
    let builtBox = await prisma.customGift.create({
      data: {
        variant_id: variantId,
      },
      select: {
        id: true,
      },
    });
    cookies().set("builtBoxId", builtBox.id);
    return {
      create: true,
      boxId: builtBox.id,
    };
  } catch (error) {
    return {
      create: false,
      boxId: null,
      error: "something went wrong during creating new box",
    };
  }
}

// add new item to custom gift includes
export async function addItemToBox(itemId: string): Promise<{
  add: boolean;
  error?: string;
}> {
  let boxId = cookies().get("builtBoxId")?.value;
  // if boxId removed from client
  if (!boxId) {
    return {
      add: false,
      error: "can't find the chosen box, please try again",
    };
  }

  let customGift = await getCustomGift(boxId);
  // if custom gift removed from db for any reason
  if (!customGift) {
    return {
      add: false,
      error: "there is no box found to add this item to it",
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
      await customGiftUpdatePrice(boxId, totalPrice);

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
    await customGiftUpdatePrice(boxId, totalPrice);

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

type dataT = {
  from: string;
  to: string;
  note: string;
  withNote: boolean;
  emptyCard: boolean;
};
// set Friendly not / message
export async function setFriendlyMessage(boxId: string, data: dataT) {
  try {
    await prisma.customGift.update({
      where: {
        id: boxId,
      },
      data: {
        from: data.from,
        to: data.to,
        note: data.note,
        with_note: data.withNote,
        empty_card: data.emptyCard,
      },
    });
    revalidatePath("");
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "something went wrong during setting the given notes",
    };
  }
}

export async function setPostCard(
  boxId: string,
  postCardId: string | null,
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!postCardId) {
      await prisma.customGift.update({
        where: {
          id: boxId,
        },
        data: {
          post_card: null,
        },
      });
      revalidatePath("");
      return { success: true };
    }
    await prisma.customGift.update({
      where: {
        id: boxId,
      },
      data: {
        post_card: postCardId,
      },
    });
    revalidatePath("");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "something went wrong during setting the Postcard",
    };
  }
}
