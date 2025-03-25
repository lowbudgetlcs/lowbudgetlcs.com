import { useEffect, useState } from "react";
import { getItem, setItem } from "../utils/sessionStorage";

export function useSessionStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState(() => {
    const item = getItem(key);

    if (item) {
      return item as T;
    } else {
      return initialValue;
    }
  });
  useEffect(() => {
    setItem(key, value);
  }, [value]);

  return [value, setValue] as const;
}
