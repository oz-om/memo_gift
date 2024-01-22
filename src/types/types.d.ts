import { Item, Prisma } from "@prisma/client";
// based types between item and premade
type image = {
  id: string;
  name: string;
};
type basedType = {
  name: string;
  desc: string;
  images: image[];
  price: number;
  categories: string[];
};

// item type
export type itemDataType = basedType & {
  theme: string;
};

// premade types
export type T_PremadeData = {
  name: string;
  desc: string;
  categories: string[];
  variants: { id: string }[];
  images: image[];
  includes: includeItemType[];
  price: number;
};
export type T_PremadeVariant = {
  id: string;
  name: string;
  value: string;
  preview: string;
};
export type includeItemType = Prisma.ItemGetPayload<{
  select: {
    id: true;
    name: true;
    price: true;
    images: true;
  };
}>;

// post card types
type T_PostCard = {
  name: string;
  image: string;
};

// set inputs value type for (premade|item|postcard|variant) inputs
export type T_setInputsValue = <fieldType extends keyof T_PremadeData>(field: fieldType, value: T_PremadeData[fieldType]) => void;
