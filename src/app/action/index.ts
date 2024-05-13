"use server";
import { prisma } from "@/lib/db/prisma";
import delay from "@/utils/delay";
import { authOptions } from "@/utils/nextAuthOptions";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

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
}>[];
export async function getCartContent(): Promise<{ success: true; cart: T_cart; totalPrice: number } | { success: false; error: string }> {
  try {
    const session = await getServerSession(authOptions);
    let userId: string | undefined;
    let userType: "user_id" | "anonymous_user" = "anonymous_user";
    if (!session) {
      let anonymousUser = cookies().get("anonymousUserId")?.value;
      userId = anonymousUser;
    } else {
      userId = session.user.id;
      userType = "user_id";
    }

    let cart: T_cart = [];
    let totalPrice = 0;

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

      let cartItems = cart.map((cart) => cart.cartItem);
      totalPrice = cartItems.reduce((acc, cartItem) => {
        let { premade, customGift, item } = cartItem;
        let product = premade || customGift || item;
        let price = product?.price as number;
        return (acc += price * cartItem.quantity);
      }, 0);
    }

    return {
      success: true,
      totalPrice,
      cart,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to get cart contents",
    };
  }
}

export type T_Address = Prisma.AddressGetPayload<{
  select: {
    user_id: true;
    address: true;
    id: true;
  };
}>;
export type T_submitAddressAction =
  | {
      action: "create";
      userId: string;
      address: string;
    }
  | {
      action: "update";
      addressId: string;
      address: string;
    };

function updateAddress(addressId: string, address: string) {
  return prisma.address.update({
    where: {
      id: addressId,
    },
    data: {
      address,
    },
    select: {
      user_id: true,
      id: true,
      address: true,
    },
  });
}
function createAddress(userId: string, address: string) {
  return prisma.address.create({
    data: {
      address,
      user_id: userId,
    },
    select: {
      user_id: true,
      id: true,
      address: true,
    },
  });
}
export async function submitAddressAction(addressDetails: T_submitAddressAction): Promise<{ success: true; address: T_Address } | { success: false; error: string }> {
  const { action, address } = addressDetails;
  await delay(3000);
  try {
    switch (action) {
      case "create":
        const newAddress = await createAddress(addressDetails.userId, address);
        revalidatePath("");
        return {
          success: true,
          address: newAddress,
        };
      case "update":
        const addressUpdate = await updateAddress(addressDetails.addressId, address);
        revalidatePath("");
        return {
          success: true,
          address: addressUpdate,
        };
      default:
        throw new Error(`action prop doesn't exist`);
    }
  } catch (error) {
    return {
      success: false,
      error: "ops! something went wrong, please try again",
    };
  }
}
export async function deleteAddress(addressId: string): Promise<{ success: true } | { success: false; error: string }> {
  await delay(3000);

  try {
    const userSession = await getServerSession(authOptions);
    if (!userSession) return { success: false, error: "you need to login to complete this process" };
    await prisma.address.delete({
      where: {
        id: addressId,
        user_id: userSession.user.id,
      },
    });
    revalidatePath("");
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "something went wrong during delete operation, please try again later!",
    };
  }
}
