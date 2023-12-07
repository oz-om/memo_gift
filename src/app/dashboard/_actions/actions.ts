import { prisma } from "@/lib/db/prisma";
import type { itemDataType } from "@/types/types";
export async function createNewItem(data: itemDataType) {
  "use server";

  console.log(data);
}
