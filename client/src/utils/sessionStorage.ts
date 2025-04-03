export const setItem = (key: string, value: unknown) => {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.log(err);
  }
};

export const getItem = (key: string) => {
  try {
    const item = window.sessionStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    } else {
      return undefined;
    }
  } catch (err) {
    console.log(err);
  }
};
