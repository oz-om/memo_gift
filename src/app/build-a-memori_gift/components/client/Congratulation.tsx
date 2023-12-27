"use client";
import { useEffect } from "react";
//@ts-ignore
import { default as confetti } from "canvas-confetti";

export default function Congratulation() {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  });
  return <></>;
}
