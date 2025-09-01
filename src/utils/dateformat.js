export const formatDate = (date) => {
  const newDate = new Date(date);

  const formatedDate = newDate.toLocaleDateString(undefined, {
    year: "2-digit",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "numeric",
  });

  return formatedDate;
};
