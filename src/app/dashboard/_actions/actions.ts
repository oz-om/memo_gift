"use server";
import { prisma } from "@/lib/db/prisma";
import type { itemDataType, T_PostCard, T_PremadeData } from "@/types/types";
import { authOptions } from "@/utils/nextAuthOptions";
import { getServerSession } from "next-auth";

function createCategories(categories: string[]) {
  return prisma.category.createMany({
    data: categories.map((category) => ({
      name: category,
    })),
    skipDuplicates: true, // This will skip creating categories if they already exist
  });
}
function reSortedAndGetImagesAsURL(images: { id: string; name: string }[], folder: string) {
  let imagesNames = images.map((image) => `https://omzid.serv00.net/images/${folder}/${image.name}`);
  imagesNames.sort((a, b) => {
    let timestampA = parseInt(a.split("_")[1]);
    let timestampB = parseInt(b.split("_")[1]);
    return timestampA - timestampB;
  });
  return imagesNames;
}

// create new item
export async function createNewItem(data: itemDataType) {
  // sort uploads as the user sorted insert
  let imagesURLs = reSortedAndGetImagesAsURL(data.images, "item");

  try {
    let req = await prisma.$transaction([
      createCategories(data.categories),
      prisma.item.create({
        data: {
          name: data.name,
          desc: data.desc,
          images: JSON.stringify(imagesURLs),
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

// create new premade
export async function createNewPremade(data: T_PremadeData): Promise<{ creation: true } | { creation: false; error: string }> {
  let imagesURLs = reSortedAndGetImagesAsURL(data.images, "premade");
  try {
    await prisma.$transaction([
      createCategories(data.categories),
      prisma.premadeGift.create({
        data: {
          name: data.name,
          desc: data.desc,
          price: Number(data.price),
          images: JSON.stringify(imagesURLs),
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
      }),
    ]);
    return {
      creation: true,
    };
  } catch (error) {
    console.log(error);
    return {
      creation: false,
      error: "ops! Something went wrong, please try again",
    };
  }
}

//  create new variant
type T_Variant = {
  name: string;
  value: string;
  preview: string;
};
type T_VariantFieldKey = keyof T_Variant;
export async function createNewVariant(data: T_Variant): Promise<{ success: true } | { success: false; error: string }> {
  let field: T_VariantFieldKey;
  for (field in data) {
    if (data[field].trim().length == 0) {
      return {
        success: false,
        error: "please enter all fields",
      };
    }
  }
  try {
    await prisma.variant.create({
      data: {
        ...data,
        preview: `https://omzid.serv00.net/images/variant/${data.preview}`,
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "ops something went wrong, please try again",
    };
  }
}

// create new post card
type T_PostCardKey = keyof T_PostCard;
export async function createNewPostCard(data: T_PostCard): Promise<{ success: true } | { success: false; error: string }> {
  let field: T_PostCardKey;
  for (field in data) {
    if (data[field].trim().length == 0) {
      return {
        success: false,
        error: "please enter all fields",
      };
    }
  }
  try {
    await prisma.postCard.create({
      data: {
        name: data.name,
        image: `https://omzid.serv00.net/images/card/${data.image}`,
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "ops something went wrong, please try again",
    };
  }
}

// create new blog
type blogInfo_T = {
  title: string;
  desc: string;
  tags: string[];
  cover: string;
};
function createBlogTags(blogTags: string[]) {
  return prisma.tag.createMany({
    data: blogTags.map((tag) => ({ tag: tag })),
    skipDuplicates: true,
  });
}
export async function createNewBlog(blogContent: string, blogInfo: blogInfo_T): Promise<{ success: true } | { success: false; error: string }> {
  const auhSession = await getServerSession(authOptions);

  try {
    if (!auhSession || auhSession.user.role !== "admin") {
      return {
        success: false,
        error: "not signed in",
      };
    }

    await prisma.$transaction([
      createBlogTags(blogInfo.tags),
      prisma.blog.create({
        data: {
          title: blogInfo.title,
          description: blogInfo.desc,
          cover: blogInfo.cover,
          content: blogContent,
          author: auhSession.user.username,
          tags: {
            connectOrCreate: blogInfo.tags.map((tag) => ({
              where: {
                blog_id_tag: {
                  tag: tag,
                  blog_id: "",
                },
              },
              create: {
                tag: tag,
              },
            })),
          },
        },
      }),
    ]);

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "there was an error during creating new blog!",
    };
  }
}
