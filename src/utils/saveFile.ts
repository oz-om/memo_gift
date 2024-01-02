import { writeFileSync } from "fs";

import { join } from "path";

export default async function (name: string, id: string, image: File) {
  const buffer = Buffer.from(await image.arrayBuffer());
  let path = join(process.cwd(), "public", "images", `upat_${id}_${name}`);

  try {
    writeFileSync(path, buffer);
  } catch (error) {
    throw new Error(error as string);
  }
}
