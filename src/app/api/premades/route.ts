import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
type T_Premade = Prisma.PremadeGiftGetPayload<{
  select: {
    id: true;
    name: true;
    images: true;
    price: true;
  };
}>;
export type T_getPremadesRes =
  | {
      success: true;
      premades: T_Premade[];
    }
  | {
      success: false;
      error: string;
    };

export async function GET(req: Request) {
  try {
    let premades: T_Premade[] = await prisma.premadeGift.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
      },
      take: 4,
    });

    return new Response(
      JSON.stringify({
        success: true,
        premades,
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
