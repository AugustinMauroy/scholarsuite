export const isPossible = (startDate: string, endDate: string) => {
  return (
    new Date(startDate) < new Date(endDate) ||
    new Date(startDate) !== new Date(endDate) ||
    new Date(startDate).getFullYear() > 2000 ||
    new Date(startDate).getFullYear() < 2100
  );
};
