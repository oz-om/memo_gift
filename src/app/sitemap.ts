import { prisma } from "@/lib/db/prisma";

export default async function sitemap() {
  let baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  let premadeProducts = await prisma.premadeGift.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  let itemsProducts = await prisma.item.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  let premadeUrls = premadeProducts.map((premade) => {
    return {
      url: `${baseUrl}/collections/premade/${premade.id}`,
      lastModified: premade.createdAt,
    };
  });
  let itemsUrls = itemsProducts.map((item) => {
    return {
      url: `${baseUrl}/collections/items/${item.id}`,
      lastModified: item.createdAt,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/collections/premade`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/collections/items`,
      lastModified: new Date(),
    },
    ...premadeUrls,
    ...itemsUrls,
    {
      url: `${baseUrl}/sign-in`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sign-up`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/build-a-memori_gift?step=one`,
      lastModified: new Date(),
    },
  ];
}
