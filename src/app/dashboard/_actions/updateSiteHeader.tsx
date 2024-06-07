"use server";

import { prisma } from "@/lib/db/prisma";

export async function updateSiteHeader(id: string, headerCover: string, headerTitle: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await prisma.site.update({
      where: { id },
      data: {
        header_cover: "https://omzid.serv00.net/images/" + headerCover,
        header_title: headerTitle,
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "something went wrong please try again!",
    };
  }
}
