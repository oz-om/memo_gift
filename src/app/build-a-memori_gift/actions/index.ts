"use server";

import { isUser } from "@/app/action";
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

// create new custom gift
export async function getCustomGift(customGiftId: string) {
  try {
    const userId = await isUser();
    if (!userId) {
      return null;
    }
    let customGift = await prisma.customGift.findUnique({
      where: {
        id: customGiftId,
        owner: userId,
      },
      include: {
        includes: {
          include: {
            item: true,
          },
        },
      },
    });
    return customGift;
  } catch (error) {
    return null;
  }
}

export async function isCustomGiftExist(customGift_id: string) {
  try {
    const ownerId = await isUser();
    if (!ownerId) {
      return false;
    }
    const customGift = await prisma.customGift.findUnique({
      where: {
        id: customGift_id,
        owner: ownerId,
      },
    });
    if (customGift) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
async function createNewCustomGift(userId: string) {
  console.log(userId);

  let customGift = await prisma.customGift.create({
    data: {
      owner: userId,
    },
  });
  cookies().set("customGiftId", customGift.id);
  return customGift.id;
}
export async function createCustomGift(): Promise<{ create: true; customGiftId: string } | { create: false; error: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return {
        create: false,
        error: "you should have an account to be able to create your own custom box gift ",
      };
    }
    const userId = session.user.id;
    const existingCustomGiftId = cookies().get("customGiftId")?.value;

    if (!existingCustomGiftId && userId) {
      let newCustomGiftId = await createNewCustomGift(userId);
      return {
        create: true,
        customGiftId: newCustomGiftId,
      };
    }

    // make sure that the customGift is in db
    let customGift = await prisma.customGift.findUnique({
      where: {
        id: existingCustomGiftId,
        owner: userId,
      },
      select: { id: true },
    });

    if (!customGift) {
      // if the custom gif deleted from db we create the new one
      cookies().delete("customGiftId");
      let newCustomGiftId = await createNewCustomGift(userId);
      return {
        create: true,
        customGiftId: newCustomGiftId,
      };
    }

    return {
      create: true,
      customGiftId: customGift.id,
    };
  } catch (error) {
    console.log(error);

    return {
      create: false,
      error: "something went wrong during start creating new custom gift, please try again",
    };
  }
}

// add new item to custom gift includes
export async function addItemToCustomGift(itemId: string, customGiftId: string | null): Promise<{ add: boolean; error?: string }> {
  const storedCustomGiftId = cookies().get("customGiftId")?.value;
  let idOfCustomGift: string | null = null;
  if (customGiftId) {
    idOfCustomGift = customGiftId;
  } else if (storedCustomGiftId) {
    idOfCustomGift = storedCustomGiftId;
  }

  // if customGiftId removed from client
  if (!idOfCustomGift) {
    return {
      add: false,
      error: "there is no custom gift found to add this item to it",
    };
  }

  try {
    let customGift = await getCustomGift(idOfCustomGift);
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
export async function chosedItemControlQuantity(customGiftId: string, itemId: string, action: "increment" | "decrement"): Promise<{ success: boolean; error?: string }> {
  try {
    // get the customGift
    let customGift = await getCustomGift(customGiftId);
    // if can't find custom gift in db for any reason
    if (!customGift) {
      return {
        success: false,
        error: "something went wrong during " + action + " this item quantity",
      };
    }

    // check the  quantity before action
    let item = await prisma.customGiftIncudes.findUnique({
      where: {
        customGift_id_item_id: {
          customGift_id: customGift.id,
          item_id: itemId,
        },
      },
      select: {
        quantity: true,
      },
    });

    // if the quantity  less than one return with nothing
    if (item && item.quantity < 1) {
      return {
        success: true,
      };
    }

    // increment|decrement the quantity
    await prisma.customGiftIncudes.update({
      where: {
        customGift_id_item_id: {
          customGift_id: customGift.id,
          item_id: itemId,
        },
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
      error: "something went wrong during " + action + " this item quantity",
    };
  }
}

// remove chosed item form custom gifts includes
export async function removeItem(itemId: string, customGiftId: string): Promise<{ deleted: boolean; error?: string }> {
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
async function setCustomGiftIntoCartItemAndGetCartItem(customGiftId: string) {
  let newCartItemId = await prisma.cartItem.create({
    data: {
      custom_gift_id: customGiftId,
    },
  });
  cookies().set("cartItemId", newCartItemId.id);
  return newCartItemId.id;
}
export async function setCustomGiftIntoCartItem(customGiftId: string, cartItemId: string | null): Promise<{ success: true; cartItemId: string } | { success: false; error: string }> {
  if (!customGiftId) {
    return {
      success: false,
      error: "cannot continue to next step",
    };
  }

  try {
    // check if custom gift is exist
    const customGift = await getCustomGift(customGiftId);

    if (!customGift) {
      return {
        success: false,
        error: "something went wrong!",
      };
    }
    // check if custom gift not empty
    let totalPrice = customGift.includes.reduce((acc, { item, quantity }) => {
      acc += item.price * quantity;
      return +acc.toFixed(2);
    }, 0);

    if (totalPrice <= 0) {
      return {
        success: false,
        error: "please chose one item at least",
      };
    }
    // check if custom gift is on a cart Item or Note
    const cartItemThatHaveThatCustomGift = await prisma.cartItem.findFirst({
      where: {
        custom_gift_id: customGift.id,
      },
    });

    // check i client have a cartItem id
    let storedCartItemId = cookies().get("cartItemId")?.value;
    let idOfCartItem: string | null = null;
    if (cartItemThatHaveThatCustomGift) {
      idOfCartItem = cartItemThatHaveThatCustomGift.id;
    } else if (cartItemId) {
      idOfCartItem = cartItemId;
    } else if (storedCartItemId) {
      idOfCartItem = storedCartItemId;
    }
    // id not cartItem found create new one and link it with the new cartItem
    if (!idOfCartItem) {
      // update customGift price ;
      await prisma.customGift.update({
        where: {
          id: customGift.id,
        },
        data: {
          price: totalPrice,
        },
      });
      let newCartItemId = await setCustomGiftIntoCartItemAndGetCartItem(customGift.id);
      return {
        success: true,
        cartItemId: newCartItemId,
      };
    }

    // if cartItem exist get that cartItem and its should contain the customGist gift
    let cartItem = await prisma.cartItem.findUnique({
      where: {
        id: idOfCartItem,
        custom_gift_id: customGift.id,
      },
      select: {
        id: true,
      },
    });

    // if cartItem with the customGift not found
    if (!cartItem) {
      // if the given cart item id is not in db we delete it and create new one
      storedCartItemId && cookies().delete("cartItemId");
      // update customGift price ;
      await prisma.customGift.update({
        where: {
          id: customGift.id,
        },
        data: {
          price: totalPrice,
        },
      });
      let newCartItemId = await setCustomGiftIntoCartItemAndGetCartItem(customGift.id);
      return {
        success: true,
        cartItemId: newCartItemId,
      };
    }
    // update customGift price ;
    await prisma.customGift.update({
      where: {
        id: customGift.id,
      },
      data: {
        price: totalPrice,
      },
    });

    return {
      success: true,
      cartItemId: cartItem.id,
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
  without_note?: boolean;
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
export async function setPostCardIntoCartItem(postCardId: string | null): Promise<{ success: boolean; error?: string }> {
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
  customGiftId: string | null;
  cartItemId: string | null;
  emptyCard: boolean;
  withoutNote: boolean;
  data: FormData;
  called: "premade" | "item" | "customGift";
  productId: string | null;
  variantId: string | null;
};
type T_setFriendlyMessageToCartItemResponse = { success: true } | { success: false; error: string };

export async function setFriendlyMessageToCartItem(params: T_setFriendlyMessageToCartItemParams): Promise<T_setFriendlyMessageToCartItemResponse> {
  let { customGiftId, cartItemId, emptyCard, withoutNote, data, called, productId, variantId } = params;

  let friendlyNoteData = {
    from: data.get("from") as string,
    to: data.get("to") as string,
    note: data.get("note") as string,
    without_note: withoutNote,
    empty_card: emptyCard,
  };
  if (withoutNote) {
    friendlyNoteData = {
      ...friendlyNoteData,
      note: "",
      without_note: true,
    };
  }
  if (emptyCard) {
    friendlyNoteData = {
      ...friendlyNoteData,
      from: "",
      to: "",
      note: "",
      without_note: true,
    };
  }

  // check if fields required and not empty
  if (!friendlyNoteData.empty_card) {
    const { from, to, note, without_note } = friendlyNoteData;
    if (!from || from.trim().length == 0 || !to || to.trim().length == 0) {
      return {
        success: false,
        error: "please enter form/to fields or enable 'white card' option",
      };
    }
    if (!without_note) {
      // without
      if (!note || note.trim().length == 0) {
        return {
          success: false,
          error: "please enter Note field or enable 'without note' option",
        };
      }
    }
  }

  let storedCartItemId = cookies().get("cartItemId")?.value;
  let idOfCartItem: string | null = null;
  if (cartItemId) {
    idOfCartItem = cartItemId;
  } else if (storedCartItemId) {
    idOfCartItem = storedCartItemId;
  }

  try {
    // if this fn called on creating custom gift so its should have cartItemId and customGiftId
    if (called === "customGift") {
      // if client doesn't have any cartItem
      if (!idOfCartItem || !customGiftId) {
        return {
          success: false,
          error: "can't complete request",
        };
      }
      // if  can't find cartItem for any reason
      let cartItem = await prisma.cartItem.findUnique({
        where: {
          id: idOfCartItem,
          custom_gift_id: customGiftId,
        },
        select: {
          id: true,
        },
      });

      // if cant found carteItem in db create new cartItem  els use founded cartItem
      if (!cartItem) {
        return {
          success: false,
          error: "can't complete process",
        };
      }
      // update post cart for the new cartItem or the existing one
      await prisma.cartItem.update({
        where: {
          id: idOfCartItem,
        },
        data: {
          ...friendlyNoteData,
        },
      });
    }

    // if this fn called during adding product (premade | item) to cart than we should create ne cartItem  we just need the productId and formData
    if (called !== "customGift" && productId) {
      await setProductIdIntoCartItemAndSetCartItemToCart(called, productId, friendlyNoteData, variantId);
    }
    revalidatePath("");
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "something went wrong during submitting your request",
    };
  }
}

type T_formData = {
  from: string;
  to: string;
  note: string;
  without_note: boolean;
  empty_card: boolean;
};
async function setProductIdIntoCartItemAndSetCartItemToCart(called: "premade" | "item", productId: string, formData: T_formData, variantId: string | null) {
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
  const newCartItem = await prisma.cartItem.create({
    data: {
      ...formData,
      [called + "_id"]: productId,
      chosed_variant: variantId,
      custom_gift_id: null,
    },
  });
  await prisma.cart.create({
    data: {
      [userType]: userId,
      cart_item: newCartItem.id,
    },
  });
  cookies().delete("cartItemId");
  if (userType == "anonymous_user") {
    cookies().set("anonymousUserId", userId);
  }
}

// add variant to cartItem that include the custom gift|premade|item and add cartItem to cart
async function addVariantToCartItem(variantId: string, cartItemId: string, customGiftId: string) {
  try {
    await prisma.cartItem.update({
      where: {
        id: cartItemId,
        custom_gift_id: customGiftId,
      },
      data: {
        chosed_variant: variantId,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
export async function setVariantAndAddCartItemToCart(customGiftId: string, cartItemId: string, variantId: string) {
  let session = await getServerSession(authOptions);
  let anonymousUser = cookies().get("anonymousUserId")?.value;
  let userType: "user_id" | "anonymous_user" = "anonymous_user";
  let userId: string | undefined = undefined;

  if (session) {
    userType = "user_id";
    userId = session.user.id;
  } else {
    userId = anonymousUser;
  }

  if (!userId) {
    return {
      success: false,
    };
  }
  try {
    await addVariantToCartItem(variantId, cartItemId, customGiftId);
    // add cartItem to cart
    const isCartItemSetToCart = await prisma.cart.findFirst({
      where: {
        cart_item: cartItemId,
      },
    });
    if (!isCartItemSetToCart) {
      await prisma.cart.create({
        data: {
          [userType]: userId,
          cart_item: cartItemId,
        },
      });
    }
    cookies().delete("customGiftId");
    cookies().delete("cartItemId");
    revalidatePath("");
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

// scan custom gift based on each step
type T_FormFields = {
  empty_card: boolean;
  from: string | null;
  to: string | null;
  without_note: boolean;
  note: string | null;
  postCard: string | undefined;
};
type T_Step = { step: "one"; customGiftId: string } | { step: "two" | "three"; cartItemId: string; customGiftId: string };

export async function scanStep(Step: T_Step) {
  switch (Step.step) {
    case "one":
      return await stepOneScan(Step.customGiftId);
    case "two":
      return await stepTwoScan(Step.cartItemId, Step.customGiftId);
    case "three":
      return await stepThreeScan(Step.cartItemId, Step.customGiftId);
    default:
      return {
        step: null,
        scanned: false,
      };
  }
}

async function stepOneScan(customGiftId: string): Promise<{ step: "one"; scanned: boolean }> {
  const isCustomGiftFound = await isCustomGiftExist(customGiftId);
  if (isCustomGiftFound) {
    return {
      step: "one",
      scanned: true,
    };
  } else {
    return {
      step: "one",
      scanned: false,
    };
  }
}
async function stepTwoScan(cartItemId: string, customGiftId: string): Promise<{ step: "two"; scanned: true; formFields: T_FormFields } | { step: "two"; scanned: false }> {
  try {
    const stepOneScanning = await stepOneScan(customGiftId);
    if (!stepOneScanning.scanned) {
      return {
        step: "two",
        scanned: false,
      };
    }
    let cartItem = await prisma.cartItem.findUnique({
      where: {
        id: cartItemId,
        custom_gift_id: customGiftId,
      },
      include: {
        postcard: true,
        customGift: {
          include: {
            includes: {
              include: {
                item: {
                  select: {
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!cartItem) {
      return {
        step: "two",
        scanned: false,
      };
    }
    // check if that cartItem is exist and check if customGift that linked with this cartItem is not empty
    let totalPrice = cartItem?.customGift?.includes.reduce((acc, { item, quantity }) => {
      acc += item.price * quantity;
      return +acc.toFixed(2);
    }, 0);
    if (!cartItem || !totalPrice || totalPrice <= 0) {
      return {
        step: "two",
        scanned: false,
      };
    }
    const { empty_card, from, to, without_note, note, postcard } = cartItem;
    const postcardPreview = postcard?.image;
    const formFields: T_FormFields = {
      empty_card,
      from,
      to,
      without_note,
      note,
      postCard: postcardPreview,
    };
    return {
      step: "two",
      scanned: true,
      formFields,
    };
  } catch (error) {
    return {
      step: "two",
      scanned: false,
    };
  }
}
async function stepThreeScan(cartItemId: string, customGiftId: string): Promise<{ step: "three"; scanned: boolean }> {
  try {
    const stepTwoScanning = await stepTwoScan(cartItemId, customGiftId);
    if (!stepTwoScanning.scanned) {
      return {
        step: "three",
        scanned: false,
      };
    }
    const { empty_card, from, to, without_note, note } = stepTwoScanning.formFields;
    if (!empty_card) {
      if (!from || from.trim().length == 0 || !to || to.trim().length == 0) {
        return {
          step: "three",
          scanned: false,
        };
      }
      if (!without_note) {
        if (!note || note.trim().length == 0) {
          return {
            step: "three",
            scanned: false,
          };
        }
      }
    }
    return {
      step: "three",
      scanned: true,
    };
  } catch (error) {
    return {
      step: "three",
      scanned: false,
    };
  }
}
