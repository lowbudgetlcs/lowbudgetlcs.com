import { useEffect, useState } from "react";
import { getLocalItem, setLocalItem } from "../utils/sessionStorage";

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState(() => {
    const item = getLocalItem(key);

    if (item !== undefined) {
      return item as T;
    } else {
      return initialValue;
    }
  });
  useEffect(() => {
    setLocalItem(key, value);
  }, [value]);

  return [value, setValue] as const;
}
