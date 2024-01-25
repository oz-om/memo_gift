"use server";

import { prisma } from "@/lib/db/prisma";

type T_UpdatedProductData = {
  name?: string;
  price?: number;
  desc?: string;
  images?: string;
};

// update premade details
type T_UpdatedPremadeRelatedData = {
  variants?: premadeVariant[];
  categories?: string[];
};
type premadeVariant = {
  id: string;
  name: string;
  value: string;
  preview: string;
};
export async function updatePremadeDetailsAction(premadeId: string, premadeData: T_UpdatedProductData, premadeRelatedData: T_UpdatedPremadeRelatedData): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const targetPremade = await prisma.premadeGift.findUnique({
      where: {
        id: premadeId,
      },
      include: {
        categories: {
          select: {
            cat: true,
          },
        },
        variants: {
          select: {
            variant: {
              select: {
                id: true,
                name: true,
                value: true,
                preview: true,
              },
            },
          },
        },
      },
    });
    await prisma.$transaction(async (tx) => {
      if (premadeData.desc || premadeData.name || premadeData.price || premadeData.images) {
        await tx.premadeGift.update({
          where: {
            id: premadeId,
          },
          data: {
            ...premadeData,
          },
        });
      }
      if (premadeRelatedData.categories && targetPremade) {
        const prevCategories = targetPremade.categories;
        // loop on all updated categories and check if the category is not existing in the previous categories than add it
        for (let i = 0; i < premadeRelatedData.categories.length; i++) {
          let existInPrev = prevCategories?.find(({ cat }) => cat.name == premadeRelatedData.categories?.[i]);
          if (!existInPrev) {
            await tx.category.upsert({
              where: {
                name: premadeRelatedData.categories?.[i],
              },
              create: {
                name: premadeRelatedData.categories?.[i],
              },
              update: {},
            });
            await tx.boxCategory.create({
              data: {
                premade_id: premadeId,
                cat_name: premadeRelatedData.categories?.[i],
              },
            });
          }
        }
        // loop on all previous categories and check if the prev category is not existing in the updated category list than remove it
        for (let i = 0; i < prevCategories.length; i++) {
          let existInUpdate = premadeRelatedData.categories?.find((category) => category == prevCategories[i].cat.name);
          if (!existInUpdate) {
            await tx.boxCategory.delete({
              where: {
                premade_id_cat_name: {
                  cat_name: prevCategories[i].cat.name,
                  premade_id: premadeId,
                },
              },
            });
          }
        }
      }
      if (premadeRelatedData.variants && targetPremade) {
        const prevVariants = targetPremade.variants;
        // loop on all updated variants and check if the variant is not existing in the previous variants than add it
        for (let i = 0; i < premadeRelatedData.variants.length; i++) {
          let existingInPrev = prevVariants?.find(({ variant }) => variant.id == premadeRelatedData.variants?.[i].id);
          if (!existingInPrev) {
            await tx.boxVariant.create({
              data: {
                variant_id: premadeRelatedData.variants?.[i].id,
                premade_id: premadeId,
              },
            });
          }
        }

        // loop on all previous variants and check if the prev variant is not existing in the updated variants list than remove it
        for (let i = 0; i < prevVariants.length; i++) {
          let existingInUpdate = premadeRelatedData.variants?.find((v) => v.id == prevVariants[i].variant.id);
          if (!existingInUpdate) {
            await tx.boxVariant.delete({
              where: {
                premade_id_variant_id: {
                  premade_id: premadeId,
                  variant_id: prevVariants[i].variant.id,
                },
              },
            });
          }
        }
      }
    });
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "ops! something went wrong, please try again",
    };
  }
}

// update item details
type T_UpdatedItemRelatedData = {
  categories?: string[];
};

export async function updateItemDetailsAction(itemId: string, itemData: T_UpdatedProductData, itemRelatedData: T_UpdatedItemRelatedData): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const targetItem = await prisma.item.findUnique({
      where: {
        id: itemId,
      },
      include: {
        categories: {
          select: {
            cat: true,
          },
        },
      },
    });
    await prisma.$transaction(async (tx) => {
      if (itemData.desc || itemData.name || itemData.price || itemData.images) {
        await tx.item.update({
          where: {
            id: itemId,
          },
          data: {
            ...itemData,
          },
        });
      }
      if (itemRelatedData.categories && targetItem) {
        const prevCategories = targetItem.categories;
        // loop on all updated categories and check if the category is not existing in the previous categories than add it
        for (let i = 0; i < itemRelatedData.categories.length; i++) {
          let existInPrev = prevCategories?.find(({ cat }) => cat.name == itemRelatedData.categories?.[i]);
          if (!existInPrev) {
            await tx.category.upsert({
              where: {
                name: itemRelatedData.categories?.[i],
              },
              create: {
                name: itemRelatedData.categories?.[i],
              },
              update: {},
            });
            await tx.itemCategory.create({
              data: {
                item_id: itemId,
                cat_name: itemRelatedData.categories?.[i],
              },
            });
          }
        }
        // loop on all previous categories and check if the prev category is not existing in the updated category list than remove it
        for (let i = 0; i < prevCategories.length; i++) {
          let existInUpdate = itemRelatedData.categories?.find((category) => category == prevCategories[i].cat.name);
          if (!existInUpdate) {
            await tx.itemCategory.delete({
              where: {
                item_id_cat_name: {
                  cat_name: prevCategories[i].cat.name,
                  item_id: itemId,
                },
              },
            });
          }
        }
      }
    });
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "ops! something went wrong, please try again",
    };
  }
}

// update postcard details
type T_UpdatedPostcardData = {
  name?: string;
  image?: string;
};
export async function updatePostcardDetailsAction(postcardId: string, postcardData: T_UpdatedPostcardData): Promise<{ success: true } | { success: false; error: string }> {
  try {
    if (postcardData.name || postcardData.image) {
      await prisma.postCard.update({
        where: {
          id: postcardId,
        },
        data: {
          ...postcardData,
        },
      });
    }
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "ops! something went wrong, please try again",
    };
  }
}

// update variant details
type T_UpdatedVariantData = {
  name?: string;
  value?: string;
  preview?: string;
};
export async function updateVariantDetailsAction(variantId: string, variantData: T_UpdatedVariantData): Promise<{ success: true } | { success: false; error: string }> {
  try {
    if (variantData.name || variantData.value || variantData.preview) {
      await prisma.variant.update({
        where: {
          id: variantId,
        },
        data: {
          ...variantData,
        },
      });
    }
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "ops! something went wrong, please try again",
    };
  }
}
