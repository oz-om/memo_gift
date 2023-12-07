import React, { useRef, useEffect, useState } from "react";

type swipeProps = {
  children: React.ReactNode[];
  childWidth?: string;
  gap?: string;
  duration?: number;
  dir?: string;
};
export default function Swipe({ children, childWidth = "120px", gap = "80px", duration = 10000, dir = "rtl" }: swipeProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const [animation, setAnimation] = useState<Animation | undefined>();

  useEffect(() => {
    const Children = Array.from(scroller.current!.children);
    // clone the items
    Children.forEach((childe) => {
      let child = childe as HTMLElement;
      child.style.flexBasis = childWidth;
      child.style.flexShrink = "0";

      let childeClone = childe.cloneNode(true);
      let childNode = childeClone as HTMLElement;
      childNode.setAttribute("added", "true");
      scroller.current!.appendChild(childeClone);
    });

    // create scroll animation
    // get the scroller real width by calc width of each child and gap between them
    let firstInScroller = scroller.current?.firstChild;
    let childPXWidth = parseInt(getComputedStyle(firstInScroller as HTMLElement).width);
    let items = children.length;

    if (scroller.current) {
      let pxGap = parseInt(getComputedStyle(scroller.current).columnGap);
      // concat results
      let width = childPXWidth * items + pxGap * items;

      // start animation
      const keyFrame = [{ right: "0" }, { right: `${width}px` }];
      const options: KeyframeAnimationOptions = {
        duration,
        iterations: Infinity,
        direction: dir == "ltr" ? "reverse" : "normal",
      };
      const animationInit = scroller.current.animate(keyFrame, options);
      setAnimation(animationInit);
    }
  }, []);
  return (
    <div
      className='swipe_wrapper'
      style={{
        overflow: "hidden",
        WebkitMask: "linear-gradient(90deg, transparent, white 20%, white 80%, transparent)",
        mask: "linear-gradient(90deg, transparent, white 20%, white 80%, transparent)",
      }}
      onMouseEnter={() => animation?.pause()}
      onMouseLeave={() => animation?.play()}
    >
      <div
        ref={scroller}
        className='scroller relative flex'
        style={{
          columnGap: gap,
        }}
      >
        {children}
      </div>
    </div>
  );
}
