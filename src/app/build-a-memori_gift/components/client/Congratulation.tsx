"use client";
import confetti from "canvas-confetti";
import { useEffect } from "react";

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
