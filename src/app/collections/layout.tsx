import type { Metadata } from "next";
import "./styles/style.css";

export const metadata: Metadata = {
  title: "collections - Memori-Gift",
  description: "make memories beautiful with amazing gifts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}
