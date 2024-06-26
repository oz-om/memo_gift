import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
type T_item = Prisma.ItemGetPayload<{
  select: {
    id: true;
    name: true;
    images: true;
    price: true;
  };
}>;
export type T_getItemsRes =
  | {
      success: true;
      items: T_item[];
    }
  | {
      success: false;
      error: string;
    };
export async function GET(req: Request) {
  try {
    let items: T_item[] = await prisma.item.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
      },
      take: 8,
    });

    return new Response(
      JSON.stringify({
        success: true,
        items,
      }),
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error,
      }),
    );
  }
}
