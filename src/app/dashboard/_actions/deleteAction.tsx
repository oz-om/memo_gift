"use server";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export type PrismaModels = Uncapitalize<Prisma.ModelName>;

export async function deleteTarget(target: PrismaModels, id: string) {
  switch (target) {
    case "premadeGift":
      return await prisma[target].delete({ where: { id } });
    case "item":
      return await prisma[target].delete({ where: { id } });
    case "postCard":
      return await prisma[target].delete({ where: { id } });
    case "variant":
      return await prisma[target].delete({ where: { id } });
    case "blog":
      return await prisma[target].delete({ where: { id } });
    default:
      throw new Error(`${target} is not an available model`);
  }
}
