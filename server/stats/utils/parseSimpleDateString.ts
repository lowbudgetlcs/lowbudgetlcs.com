const parseSimpleDateString = (dateString: string | null | undefined) => {
  //! Date needs changing every season
  const tempDate = new Date("2025-07-01");

  if (!dateString) {
    return tempDate;
  }

  const datePart = dateString.split(" ")[0];
  let month: number;
  let day: number;
  const year = new Date().getFullYear(); //Assumes Current Year

  if (datePart.includes("/")) {
    const dateComponents = datePart.split("/");
    if (dateComponents.length < 2) return tempDate;
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
      return tempDate;
    }
  }

  if (isNaN(month) || isNaN(day) || month < 0 || month > 11 || day < 1 || day > 31) {
    return tempDate;
  }

  // Validate day count for the specific month
  const testDate = new Date(year, month, day);
  if (testDate.getMonth() !== month || testDate.getDate() !== day) {
    return tempDate;
  }

  return new Date(year, month, day);
};

export default parseSimpleDateString;
