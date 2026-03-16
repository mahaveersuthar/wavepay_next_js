import { useEffect, RefObject } from "react";

/**
 * A custom React hook that detects clicks outside of a specified element.
 * @param ref - The React ref object attached to the element to monitor.
 * @param callback - The function to call when a click outside is detected.
 */
const useOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]); // Re-run the effect if ref or callback changes
};

export default useOutsideClick;
