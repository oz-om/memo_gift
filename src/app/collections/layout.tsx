import QueryCtProvider from "./context/QueryCtProvider";
import "./styles/style.css";
import React from "react";

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryCtProvider>{children}</QueryCtProvider>
    </>
  );
}
