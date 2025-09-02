export const formatDate = (date) => {
  if (!date) {
    return "";
  }

  const [datePart, timePart] = date.split("T");

  const cleanedTimePart = timePart
    ? timePart.split(":").slice(0, 2).join(":")
    : "";

  return `${datePart} ${cleanedTimePart}`.trim();
};
