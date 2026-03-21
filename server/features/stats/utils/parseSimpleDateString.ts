const parseSimpleDateString = (dateString: string | null | undefined, fallbackDate: Date = new Date()) => {
  if (!dateString) {
    return fallbackDate;
  }

  const datePart = dateString.split(" ")[0];
  let month: number;
  let day: number;
  let year = new Date().getFullYear();

  if (datePart.includes("/")) {
    const dateComponents = datePart.split("/");
    if (dateComponents.length < 2) return fallbackDate;
    month = parseInt(dateComponents[0], 10) - 1;
    day = parseInt(dateComponents[1], 10);
  } else {
    if (datePart.length === 4) {
      // MMDD
      month = parseInt(datePart.substring(0, 2), 10) - 1;
      day = parseInt(datePart.substring(2, 4), 10);
    } else if (datePart.length === 3) {
      // MDD
      month = parseInt(datePart.substring(0, 1), 10) - 1;
      day = parseInt(datePart.substring(1, 3), 10);
    } else {
      return fallbackDate;
    }
  }

  if (isNaN(month) || isNaN(day) || month < 0 || month > 11 || day < 1 || day > 31) {
    return fallbackDate;
  }

  const testDate = new Date(year, month, day);
  if (testDate.getMonth() !== month || testDate.getDate() !== day) {
    return fallbackDate;
  }

  const now = new Date();
  const twoMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());
  if (testDate > twoMonthsFromNow) {
    year -= 1;
    // Leap year check
    const adjusted = new Date(year, month, day);
    if (adjusted.getMonth() !== month || adjusted.getDate() !== day) {
      return fallbackDate;
    }
  }

  return new Date(year, month, day);
};

export default parseSimpleDateString;
