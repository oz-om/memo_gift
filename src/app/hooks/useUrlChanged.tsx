import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type resetFnType = () => void;
type useUrlChangedProps = {
  eleClass: string;
  openClass: string;
  resetFn: resetFnType;
};
export function useUrlChanged({ eleClass, openClass, resetFn }: useUrlChangedProps) {
  let path = usePathname();
  let searchParams = useSearchParams();
  useEffect(() => {
    let openedElement = document.querySelector(eleClass)?.classList.contains(openClass);
    if (openedElement) {
      resetFn();
    }
  }, [path, searchParams.toString()]);
}
