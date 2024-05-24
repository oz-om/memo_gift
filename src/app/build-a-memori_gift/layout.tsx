import React from "react";
import "./styles/build-page.css";
import QueryCtProvider from "./context/QueryCtProvider";
export const metadata = {
  title: "build your Memori-Gift",
  description: "make memories beautiful with amazing gifts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <QueryCtProvider>{children}</QueryCtProvider>
    </main>
  );
}
