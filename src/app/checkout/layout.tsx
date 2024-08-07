import type { Metadata } from "next";
import "./styles/style.css";

export const metadata: Metadata = {
  title: "payment success",
  description: "make memories beautiful with amazing gifts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}
