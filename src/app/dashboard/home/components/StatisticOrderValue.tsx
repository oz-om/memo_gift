"use client";
import React, { useEffect, useState } from "react";

export default function StatisticOrderValue({ value, name }: { value: number; name: string }) {
  const [currentValue, setCurrentValue] = useState(0);
  useEffect(() => {
    // Clear any existing interval
    const intervalId = setInterval(() => {
      setCurrentValue((prevValue) => {
        if (prevValue >= value) {
          clearInterval(intervalId);
          return prevValue;
        }
        return prevValue + 1;
      });
    }, 50); // Adjust the speed of increment here

    // Clear interval on cleanup
    return () => clearInterval(intervalId);
  }, [value]); // Only re-run the effect if targetValue changes
  return <div className='count text-5xl px-3 text-stroke text-white transition-all'>{currentValue}</div>;
  {
    /* {name == "complete" && "%"} */
  }
}
