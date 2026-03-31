/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * A standard debounce function to limit how often a function can be triggered.
 *
 * @param func The function to debounce.
 * @param wait The delay in milliseconds.
 * @param leading If true, triggers the function on the leading edge (immediately).
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  leading = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const callNow = leading && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = null;
      if (!leading) {
        func(...args);
      }
    }, wait);

    if (callNow) {
      func(...args);
    }
  };
}
