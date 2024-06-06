"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

type limitListType = {
  one: string[];
  two: string[];
  three: string[];
  four: [];
};
type LimitListKeys = keyof limitListType;

export default function Steps_progressbar({}) {
  const router = useRouter();
  const params = useSearchParams();
  const path = usePathname();
  const currentStep = params.get("step") as LimitListKeys;

  function handleSearchParams({ currentTarget: stepElement }: React.MouseEvent<HTMLElement>) {
    const limitList: limitListType = {
      one: ["two", "three", "four"],
      two: ["three", "four"],
      three: ["four"],
      four: [],
    };

    let step_level = stepElement.dataset.redirectTo as LimitListKeys;
    if (!limitList[currentStep].includes(step_level as never)) {
      limitList[step_level].forEach((step: string) => {
        let station = document.querySelectorAll(`li[data-redirect-to="${step}"]`);
        station.forEach((stationEle) => {
          stationEle.classList.remove("active_step");
        });
      });

      let paramsString = params.toString();
      // Replace the prev step value with the chosed one
      paramsString = paramsString.replace(/(?<=step=)[^&]+/, step_level);
      router.push(`${path}?${paramsString}`);
    }
  }

  function styleCurrentStep() {
    let beforeCurrentStep = {
      one: ["one"],
      two: ["one", "two"],
      three: ["one", "two", "three"],
      four: ["one", "two", "three", "four"],
    };
    if (window) {
      const allSteps = document.querySelectorAll(".steps_bar .steps ul > li");
      allSteps.forEach((step) => {
        step.classList.remove("active_step");
      });
    }
    beforeCurrentStep[currentStep].map((step) => {
      let currentStation = document.querySelectorAll(`li[data-redirect-to="${step}"]`);
      currentStation.forEach((station) => {
        station.classList.add("active_step");
      });
    });
  }

  useEffect(() => {
    styleCurrentStep();
    document.body.classList.remove("overflow-hidden");
  }, [currentStep]);

  return (
    <section className='build_steps_progress_section'>
      <div className='container'>
        <div className='steps_bar'>
          <p className='text-slate-400 text-sm mb-6'>progress: 1/3 steps</p>
          <div className='steps'>
            <ul className='steps_number flex justify-evenly '>
              <li data-redirect-to='one' onClick={handleSearchParams} className='step_number basis-1/3 text-center relative  active_step'>
                <span className='w-6 h-6 inline-grid place-content-center cursor-pointer rounded-full border-2 border-slate-400 bg-white'>1</span>
              </li>
              <li data-redirect-to='two' onClick={handleSearchParams} className='step_number basis-1/3 text-center relative '>
                <span className='w-6 h-6 inline-grid place-content-center cursor-pointer rounded-full border-2 border-slate-400 bg-white'>2</span>
              </li>
              <li data-redirect-to='three' onClick={handleSearchParams} className='step_number basis-1/3 text-center relative '>
                <span className='w-6 h-6 inline-grid place-content-center cursor-pointer rounded-full border-2 border-slate-400 bg-white'>3</span>
              </li>
              <li data-redirect-to='four' onClick={handleSearchParams} className='step_number basis-1/3 text-center relative '>
                <span className='w-6 h-6 inline-grid place-content-center cursor-pointer rounded-full border-2 border-slate-400 bg-white'>4</span>
              </li>
            </ul>
            <ul className='steps_name flex justify-evenly '>
              <li data-redirect-to='one' onClick={handleSearchParams} className='step_name basis-1/3 text-center text-slate-400  cursor-pointer active_step'>
                chose Gift Items
              </li>
              <li data-redirect-to='two' onClick={handleSearchParams} className='step_name basis-1/3 text-center text-slate-400  cursor-pointer '>
                chose Card
              </li>
              <li data-redirect-to='three' onClick={handleSearchParams} className='step_name basis-1/3 text-center text-slate-400  cursor-pointer'>
                packaging
              </li>
              <li data-redirect-to='four' onClick={handleSearchParams} className='step_name basis-1/3 text-center text-slate-400  cursor-pointer'>
                Done
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
