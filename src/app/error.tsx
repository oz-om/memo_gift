"use client";
import React from "react";
import LoadingSpin from "./components/LoadingSpin";

export default function Error() {
  return (
    <>
      <div className='error'>
        our services is busy
        <LoadingSpin />
      </div>
    </>
  );
}
