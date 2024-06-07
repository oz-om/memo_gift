import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
export type T_HeaderHeroRes =
  | {
      success: true;
      header: Prisma.SiteGetPayload<{}>;
    }
  | { success: false; error: string };
export async function GET() {
  try {
    const headerHero = await prisma.site.findFirst();
    if (!headerHero) {
      return new Response(
        JSON.stringify({
          success: true,
        }),
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        header: headerHero,
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
