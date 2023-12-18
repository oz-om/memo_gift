"use server";
import { prisma } from "@/lib/db/prisma";
import type { itemDataType, premadeDataType } from "@/types/types";

function createCategories(categories: string[]) {
  return prisma.category.createMany({
    data: categories.map((category) => ({
      name: category,
    })),
    skipDuplicates: true, // This will skip creating categories if they already exist
  });
}
function reSorted(images: { id: string; name: string }[]) {
  let imagesNames = images.map((image) => `https://omzid.serv00.net/images/${image.name}`);
  imagesNames.sort((a, b) => {
    let timestampA = parseInt(a.split("_")[1]);
    let timestampB = parseInt(b.split("_")[1]);
    return timestampA - timestampB;
  });
  return imagesNames;
}
export async function createNewItem(data: itemDataType) {
  // sort uploads as the user sorted insert
  let imagesNames = reSorted(data.images);

  try {
    let req = await prisma.$transaction([
      createCategories(data.categories),
      prisma.item.create({
        data: {
          name: data.name,
          desc: data.desc,
          images: JSON.stringify(imagesNames),
          theme: data.theme,
          price: Number(data.price),
          categories: {
            connectOrCreate: data.categories.map((category) => ({
              where: {
                item_id_cat_name: {
                  item_id: "",
                  cat_name: category,
                },
              },
              create: {
                cat_name: category,
              },
            })),
          },
        },
        include: {
          categories: {
            select: {
              cat_name: true,
            },
          },
        },
      }),
    ]);

    return {
      creation: true,
      item: req,
      msg: "item created successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      creation: false,
      error: "something went wrong, please try again!",
    };
  }
}

export async function createNewPremade(data: premadeDataType) {
  let imagesNames = reSorted(data.images);
  try {
    let req = await prisma.$transaction([
      createCategories(data.categories),
      prisma.premadeGift.create({
        data: {
          name: data.name,
          desc: data.desc,
          price: Number(data.price),
          images: JSON.stringify(imagesNames),
          categories: {
            connectOrCreate: data.categories.map((cat) => ({
              where: { premade_id_cat_name: { premade_id: "", cat_name: cat } },
              create: {
                cat_name: cat,
              },
            })),
          },
          includes: {
            connectOrCreate: data.includes.map((item) => ({
              where: {
                premade_id_item_id: {
                  premade_id: "",
                  item_id: item.id,
                },
              },
              create: {
                item_id: item.id,
              },
            })),
          },
          variants: {
            connectOrCreate: data.variants.map((v) => ({
              where: {
                premade_id_variant_id: {
                  premade_id: "",
                  variant_id: v.id,
                },
              },
              create: {
                variant_id: v.id,
              },
            })),
          },
        },
        include: {
          categories: {
            select: {
              cat_name: true,
            },
          },
          variants: {
            select: {
              variant: true,
            },
          },
          includes: {
            select: {
              item: true,
            },
          },
        },
      }),
    ]);
    return {
      creation: true,
      req,
    };
  } catch (error) {
    console.log(error);
    return {
      creation: false,
      error: error,
    };
  }
}
