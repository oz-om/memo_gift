"use server";

import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/utils/nextAuthOptions";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export type item = Prisma.ItemGetPayload<{
  select: {
    id: true;
    name: true;
    price: true;
    images: true;
    theme: true;
    desc: true;
    categories: {
      select: {
        cat_name: true;
      };
    };
  };
}>;
// get items
export async function getItems(): Promise<{ success: true; data: item[] } | { success: false; error: string }> {
  try {
    const items = await prisma.item.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        theme: true,
        desc: true,
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
      error: "something went wrong, please try again",
    };
  }
}

async function getCustomGift(customGiftId: string) {
  let builtBox = await prisma.customGift.findUnique({
    where: {
      id: customGiftId,
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
async function customGiftUpdatePrice(customGiftId: string, price: number) {
  await prisma.customGift.update({
    where: {
      id: customGiftId,
    },
    data: {
      price: price,
    },
  });
}

// create new custom gift
async function createNewCustomGift() {
  let customGift = await prisma.customGift.create({
    data: {},
  });
  cookies().set("customGiftId", customGift.id);
  return customGift.id;
}
export async function createCustomGift(): Promise<{
  create: boolean;
  customGiftId: string | null;
  error?: string;
}> {
  let existingCustomGiftId = cookies().get("customGiftId")?.value;
  try {
    if (!existingCustomGiftId) {
      let newCustomGiftId = await createNewCustomGift();
      return {
        create: true,
        customGiftId: newCustomGiftId,
      };
    }
    // make sure that the customGift is in db
    let customGift = await prisma.customGift.findUnique({
      where: { id: existingCustomGiftId },
      select: { id: true },
    });

    if (!customGift) {
      // if the custom gif deleted from db we create the new one
      cookies().delete("customGiftId");
      let newCustomGiftId = await createNewCustomGift();
      return {
        create: true,
        customGiftId: newCustomGiftId,
      };
    }

    return {
      create: true,
      customGiftId: existingCustomGiftId,
    };
  } catch (error) {
    return {
      create: false,
      customGiftId: null,
      error: "something went wrong during start creating new custom gift, please try again",
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
      error: "there is no custom gift found to add this item to it",
    };
  }

  try {
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
        id: true,
      },
    });

    // if we can't find the added item for any reason
    if (!addedItem) {
      return {
        add: false,
        error: "there is a problem with adding this item, please try again",
      };
    }

    // if item doesn't exist yet in custom gift includes so we need to add it as new item
    let items = customGift.includes.map((include) => include.item_id);
    if (!items.includes(addedItem.id)) {
      await prisma.customGiftIncudes.create({
        data: {
          customGift_id: customGift.id,
          item_id: addedItem.id,
        },
      });

      revalidatePath("");
      return {
        add: true,
      };
    }

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

    revalidatePath("");
    return {
      add: true,
    };
  } catch (error) {
    return {
      add: false,
      error: "something went wrong during add this item ",
    };
  }
}

//customGift control the quantity of chosed item ( increment|decrement )
export async function chosedItemControlQuantity(
  customGiftId: string,
  itemId: string,
  action: "increment" | "decrement",
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // check the  quantity before action
    let item = await prisma.customGiftIncudes.findUnique({
      where: {
        customGift_id_item_id: {
          customGift_id: customGiftId,
          item_id: itemId,
        },
      },
      select: {
        quantity: true,
      },
    });

    // if the quantity is go to less than one return with nothing
    if (item && item.quantity < 1) {
      return {
        success: true,
      };
    }

    // increment|decrement the quantity
    await prisma.customGiftIncudes.update({
      where: {
        customGift_id_item_id: {
          customGift_id: customGiftId,
          item_id: itemId,
        },
      },
      data: {
        quantity: {
          [action]: 1,
        },
      },
    });

    // get the customGift
    let customGift = await getCustomGift(customGiftId);
    // if can't find custom gift in db for any reason
    if (!customGift) {
      return {
        success: false,
        error: "something went wrong during " + action + " this item quantity",
      };
    }

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
  customGiftId: string,
): Promise<{
  deleted: boolean;
  error?: string;
}> {
  try {
    // deleting the item
    await prisma.customGiftIncudes.delete({
      where: {
        customGift_id_item_id: {
          customGift_id: customGiftId,
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

// set custom gift to cartItem
async function setCustomGiftAsCartItem(customGiftId: string) {
  let newCartItemId = await prisma.cartItem.create({
    data: {
      custom_gift_id: customGiftId,
    },
  });
  cookies().set("cartItemId", newCartItemId.id);
  return newCartItemId.id;
}
export async function setCustomGiftIntoCartItem(
  customGiftId: string,
  customGiftPrice: number,
): Promise<
  | {
      success: true;
      cartItemId: string;
    }
  | {
      success: false;
      error: string;
    }
> {
  if (!customGiftId) {
    return {
      success: false,
      error: "cannot continue to next step",
    };
  }

  try {
    if (customGiftPrice <= 0) {
      return {
        success: false,
        error: "please chose one item at least",
      };
    }
    // update customGift price ;
    await prisma.customGift.update({
      where: {
        id: customGiftId,
      },
      data: {
        price: customGiftPrice,
      },
    });

    // check i client have a cartItem id
    let cartItemId = cookies().get("cartItemId")?.value;
    if (!cartItemId) {
      let newCartItemId = await setCustomGiftAsCartItem(customGiftId);
      return {
        success: true,
        cartItemId: newCartItemId,
      };
    }

    // make sure that is cartItem is existing in db
    let cartItem = await prisma.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
      select: {
        id: true,
      },
    });
    if (!cartItem) {
      // if the given cart item id is not in db we delete it and create new one
      cookies().delete("cartItemId");
      let newCartItemId = await setCustomGiftAsCartItem(customGiftId);
      return {
        success: true,
        cartItemId: newCartItemId,
      };
    }

    await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        custom_gift_id: customGiftId,
      },
    });

    return {
      success: true,
      cartItemId,
    };
  } catch (error) {
    return {
      success: false,
      error: "something went wrong during get next step",
    };
  }
}

// setup post card to cartItem
type TcartItemData = {
  from?: string | null;
  to?: string | null;
  note?: string | null;
  with_note?: boolean;
  empty_card?: boolean;
  post_card?: string | null;
};
async function createNewCartItem(data: TcartItemData) {
  cookies().delete("cartItemId");
  let cartItem = await prisma.cartItem.create({
    data: {
      ...data,
    },
  });
  cookies().set("cartItemId", cartItem.id);
  return cartItem.id;
}
export async function setPostCardIntoCartItem(postCardId: string | null): Promise<{
  success: boolean;
  error?: string;
}> {
  let cartItemId = cookies().get("cartItemId")?.value;
  try {
    // if client does not have a cart item
    if (!cartItemId) {
      await createNewCartItem({
        post_card: postCardId,
      });
      revalidatePath("");
      return { success: true };
    }

    // if can't fund cartItem for any reason
    let cartItem = await prisma.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
    });
    if (!cartItem) {
      await createNewCartItem({
        post_card: postCardId,
      });
      revalidatePath("");
      return { success: true };
    }

    // if cartItem is already existing we update the post card
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
    return {
      success: false,
      error: "something went wrong during setting the Postcard",
    };
  }
}

// set Friendly not / message to cartItem
type T_setFriendlyMessageToCartItemParams = {
  emptyCard: boolean;
  withNote: boolean;
  data: FormData;
  called: "premade" | "item" | "customGift";
  productId: string | null;
  variantId: string | null;
};
type T_setFriendlyMessageToCartItemResponse = { success: true } | { success: false; error: string };

export async function setFriendlyMessageToCartItem(params: T_setFriendlyMessageToCartItemParams): Promise<T_setFriendlyMessageToCartItemResponse> {
  let { emptyCard, withNote, data, called, productId, variantId } = params;

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
  let cartItemId = cookies().get("cartItemId")?.value;
  try {
    // if client doesn't have any cartItem yet
    if (!cartItemId) {
      cartItemId = await createNewCartItem({
        ...friendlyNoteData,
      });
    } else {
      // if  can't find cartItem for any reason
      let cartItem = await prisma.cartItem.findUnique({
        where: {
          id: cartItemId,
        },
        select: {
          id: true,
        },
      });

      if (!cartItem) {
        cartItemId = await createNewCartItem({
          ...friendlyNoteData,
        });
      } else {
        cartItemId = cartItem.id;
      }
    }

    // update post cart for the new cartItem or the existing one
    await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        ...friendlyNoteData,
      },
    });

    // if called is a premade or item product we need to set the productId into cartItem and set cartItem to cart
    if (called !== "customGift" && productId) {
      await setProductIdIntoCartItemAndSetCartItemToCart(called, productId, cartItemId as string, variantId);
    }
    revalidatePath("");
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
async function setProductIdIntoCartItemAndSetCartItemToCart(called: "premade" | "item", productId: string, cartItemId: string, variantId: string | null) {
  let session = await getServerSession(authOptions);
  let userType: "user_id" | "anonymous_user" = "anonymous_user";
  let userId: string | undefined = undefined;
  if (session) {
    userType = "user_id";
    userId = session.user.id;
  } else {
    let anonymousUser = cookies().get("anonymousUserId")?.value;
    userId = anonymousUser;
  }

  userId = userId ?? crypto.randomUUID();

  await prisma.cartItem.update({
    where: {
      id: cartItemId,
    },
    data: {
      custom_gift_id: null,
      [called + "_id"]: productId,
      chosed_variant: variantId,
    },
  }),
    await prisma.cart.create({
      data: {
        [userType]: userId,
        cart_item: cartItemId,
      },
    });
  cookies().delete("cartItemId");
  if (userType == "anonymous_user") {
    cookies().set("anonymousUserId", userId);
  }
}

// add variant to cartItem that include the custom gift|premade|item and add cartItem to cart
async function addVariantToCartItem(variantId: string, cartItemId: string) {
  await prisma.cartItem.update({
    where: {
      id: cartItemId,
    },
    data: {
      chosed_variant: variantId,
    },
  });
}
export async function setVariantAndAddCartItemToCart(cartItemId: string, variantId: string) {
  let session = await getServerSession(authOptions);

  let userType: "user_id" | "anonymous_user" = "anonymous_user";
  let userId: string | undefined = undefined;

  if (session) {
    userType = "user_id";
    userId = session.user.id;
  } else {
    let anonymousUser = cookies().get("anonymousUserId")?.value;
    userId = anonymousUser;
  }

  try {
    await addVariantToCartItem(variantId, cartItemId);
    // add cartItem to cart
    if (!userId) {
      userId = crypto.randomUUID();
      await prisma.cart.create({
        data: {
          [userType]: userId,
          cart_item: cartItemId,
        },
      });
      cookies().delete("customGiftId");
      cookies().delete("cartItemId");
      cookies().set("anonymousUserId", userId);
      return {
        success: true,
        userId: userId,
      };
    }

    await prisma.cart.create({
      data: {
        [userType]: userId,
        cart_item: cartItemId,
      },
    });
    cookies().delete("customGiftId");
    cookies().delete("cartItemId");
    return {
      success: true,
      userId: userId,
    };
  } catch (error) {
    return {
      success: false,
      userId: null,
    };
  }
}
