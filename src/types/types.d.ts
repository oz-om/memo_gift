import { Item, Prisma } from "@prisma/client";

type basedType = {
  name: string;
  desc: string;
  images: images[];
  price: number;
  categories: string[];
};
type images = {
  id: string;
  name: string;
};
export type itemDataType = basedType & {
  theme: string;
};

export type premadeDataType = basedType & {
  variants: variant[];
  includes: includeItemType[];
};
type variant = {
  id: string;
  variantName: string;
  variantTheme: string;
};
// type includeItemType = {
//   id: string;
//   name: string;
//   images: string;
//   price: number;
// };
type includeItemType = Prisma.ItemGetPayload<{
  select: {
    id: true;
    name: true;
    price: true;
    images: true;
  };
}>;
