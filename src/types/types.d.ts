import { Item, Prisma } from "@prisma/client";
// based types between item and premade
type image = {
  id: string;
  name: string;
};

// item type
export type itemDataType = {
  name: string;
  desc: string;
  images: image[];
  price: number;
  categories: string[];
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
export type includeItemType = {
  id: string;
  name: string;
  price: number;
  images: string;
  quantity: number;
};

// post card types
type T_PostCard = {
  name: string;
  image: string;
};

// set inputs value type for (premade|item|postcard|variant) inputs
type T_allFields = {
  name: string;
  desc: string;
  price: number;
  images: image[];
  image: string;
  cover: string;
  theme: string;
  categories: string[];
  tags: string[];
  includes: includeItemType[];
  variants: { id: string }[];
  value: string;
  title: string;
};
export type T_setInputsValue = <fieldType extends keyof T_allFields>(field: fieldType, value: T_allFields[fieldType]) => void;
