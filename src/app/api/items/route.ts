import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request) {
  try {
    let items = await prisma.item.findMany({
      orderBy: { createdAt: "desc" },
    });

    return new Response(
      JSON.stringify({
        getItems: true,
        items,
      }),
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        getItems: false,
        error: error,
      }),
    );
  }
}
