const parseSimpleDateString = (dateString: string) => {
  const parts = dateString.split(" ");
  const datePart = parts[0];

  let hour = 0;
  let minute = 0;

  if (parts.length > 1) {
    const timePart = parts[1];
    const normalizedTime = timePart.replace(":", "");
    if (normalizedTime.length === 4) {
      hour = parseInt(normalizedTime.substring(0, 2), 10);
      minute = parseInt(normalizedTime.substring(2, 4), 10);
    }
  }

  const dateComponents = datePart.split("/");
  const year = new Date().getFullYear(); // Assumes the current year
  const month = parseInt(dateComponents[0], 10) - 1;
  const day = parseInt(dateComponents[1], 10);

  return new Date(year, month, day, hour, minute);
}

export default parseSimpleDateString;
