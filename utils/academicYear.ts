export const isPossible = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const validYear = start.getFullYear() >= 2000 && start.getFullYear() <= 2100;

  return validYear && start < end;
};
