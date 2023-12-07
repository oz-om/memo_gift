export type itemDataType = {
  name: string;
  desc: string;
  categories: string[];
  theme: string;
  images: string[];
  price: number;
};

type variant = {
  id: string;
  variantName: string;
};

export type premadeDataType = {
  name: string;
  desc: string;
  categories: string[];
  variants: variant[];
  images: string[];
  includes: string[];
  price: number;
};
