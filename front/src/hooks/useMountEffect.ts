import { useEffect } from "react";

// Run fn once when control is first mounted
export function useMountEffect(fn:()=>void) {
  useEffect(fn, []);
}
