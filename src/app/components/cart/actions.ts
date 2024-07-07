"use server";

import { isUser } from "@/app/action";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/utils/nextAuthOptions";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// get cart content
export type T_cart = Prisma.CartGetPayload<{
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
      };
    };
  };
}>;
export async function getCartContent(): Promise<{ success: true; cart: T_cart[] } | { success: false; error: string }> {
  try {
    let userId: string | null = null;
    let userType: "user_id" | "anonymous_user" = "anonymous_user";
    const user = await isUser();
    if (user.email) {
      userId = user.id;
      userType = "user_id";
    } else if (user.id) {
      userId = user.id;
    }

    let cart: T_cart[] = [];
    if (userId) {
      cart = await prisma.cart.findMany({
        where: {
          [userType]: userId,
        },
        include: {
          cartItem: {
            include: {
              customGift: {
                include: {
                  includes: {
                    include: {
                      item: true,
                    },
                  },
                },
              },
              premade: {
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
            },
          },
        },
      });
    }

    return {
      success: true,
      cart,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to get cart contents",
    };
  }
}

export async function controlCartItemQuantity(cartItemId: string, action: "increment" | "decrement") {
  try {
    const targetCartItem = await prisma.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
      select: {
        quantity: true,
      },
    });
    if (targetCartItem && action == "decrement" && targetCartItem.quantity <= 1) {
      return {
        success: false,
        error: "something went wrong during " + action + " item quantity",
      };
    }
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

export async function deleteAction(cartItemId: string): Promise<{ delete: true } | { delete: false; error: string }> {
  try {
    const deletedCartItem = await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
      select: {
        customGift: {
          select: {
            id: true,
          },
        },
      },
    });
    if (deletedCartItem.customGift) {
      await prisma.customGift.delete({
        where: {
          id: deletedCartItem.customGift.id,
        },
      });
    }
    revalidatePath("");
    return {
      delete: true,
    };
  } catch (error) {
    return {
      delete: false,
      error: "ops! Something went wrong, please try again",
    };
  }
}

// extract the cartItem to a new cartItem to set it as premade/customGift editable
type T_PremadeGift = Prisma.cartItemGetPayload<{
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
  };
}>;
type T_CustomGift = Prisma.cartItemGetPayload<{
  include: {
    customGift: {
      include: {
        includes: {
          include: {
            item: true;
          };
        };
      };
    };
  };
}>;
type T_targetCartItem = T_PremadeGift | T_CustomGift | null;

export async function editAction(cartItemId: string, targetProductType: "premade" | "customGift"): Promise<{ success: true; cgid: string } | { success: false; error: string }> {
  let targetCartItem: T_targetCartItem = null;

  try {
    // check if there a user
    let userId: string;
    const user = await isUser();
    if (!user.id) {
      userId = crypto.randomUUID();
      cookies().set("anonymousUserId", userId);
    } else {
      userId = user.id;
    }

    // get the target product
    if (targetProductType == "premade") {
      targetCartItem = await prisma.cartItem.findUnique({
        where: {
          id: cartItemId,
        },
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
        },
      });
    }
    if (targetProductType === "customGift") {
      targetCartItem = await prisma.cartItem.findUnique({
        where: {
          id: cartItemId,
        },
        include: {
          customGift: {
            include: {
              includes: {
                include: {
                  item: true,
                },
              },
            },
          },
        },
      });
    }
    // if can't find the target product for any reason
    if (!targetCartItem) {
      return {
        success: false,
        error: "can't edit the target item",
      };
    }
    const targetProduct = "customGift" in targetCartItem ? targetCartItem.customGift : "premade" in targetCartItem ? targetCartItem.premade : null;

    if (!targetProduct) {
      return {
        success: false,
        error: "can't edit the target item",
      };
    }

    const targetProductTotalPrice = targetProduct.includes.reduce((price, { item, quantity }) => {
      return (price += item.price * quantity);
    }, 0);

    // create new custom gift
    let newCustomGift = await prisma.customGift.create({
      data: {
        price: targetProductTotalPrice,
        name: "custom gift",
        owner: userId,
      },
    });
    //  extract target product includes to the new created custom gift
    const createdIncludes = targetProduct.includes.map(async (include) => {
      let data = {
        customGift_id: newCustomGift.id,
        item_id: include.item.id,
        quantity: include.quantity,
      };
      return prisma.customGiftIncudes.create({ data });
    });
    await Promise.all(createdIncludes).catch((error) => {
      console.log("there is an error during creating");
      console.log(error);
      return {
        success: false,
        error: "there is a problem during extracting includes",
      };
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

export async function duplicate(cartItemId: string): Promise<{ success: true; cartItem: T_cart } | { success: false; error: string }> {
  if (!cartItemId) {
    return {
      success: false,
      error: "there is no cart item to duplicate",
    };
  }

  try {
    // check if there a user
    let userType: "user_id" | "anonymous_user" = "anonymous_user";
    let userId: string | undefined = undefined;
    let session = await getServerSession(authOptions);
    if (session) {
      userId = session.user.id;
      userType = "user_id";
    } else {
      let anonymousUser = cookies().get("anonymousUserId")?.value;
      userId = anonymousUser;
    }
    if (!userId) {
      return {
        success: false,
        error: "not authenticated",
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
          owner: userId,
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
    const cart = await prisma.cart.create({
      data: {
        [userType]: userId,
        cart_item: duplicatedCartItem.id,
      },
      include: {
        cartItem: {
          include: {
            customGift: {
              include: {
                includes: {
                  select: {
                    quantity: true,
                    item: true,
                  },
                },
              },
            },
            premade: {
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
          },
        },
      },
    });
    revalidatePath("");
    return {
      success: true,
      cartItem: cart,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "something went wrong, please try again",
    };
  }
}
