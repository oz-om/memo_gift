"use server";

import { prisma } from "@/lib/db/prisma";

type premadeVariant = {
  id: string;
  name: string;
  value: string;
  preview: string;
};
type T_UpdatedPremadeData = {
  name?: string;
  price?: number;
  desc?: string;
  images?: string;
};
type T_UpdatedPremadeRelatedData = {
  variants?: premadeVariant[];
  categories?: string[];
};
export async function updatePremadeDetailsAction(premadeId: string, premadeData: T_UpdatedPremadeData, premadeRelatedData: T_UpdatedPremadeRelatedData): Promise<{ success: true } | { success: false; error: string }> {
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
