export const isPossible = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const validYear = start.getFullYear() >= 2000 && start.getFullYear() <= 2100;

  return validYear && start < end;
};

export const generateCurrentAcademicYear = () => {
  const now = new Date();
  const data = {
    startDate: new Date(),
    endDate: new Date(),
    name: '',
  };

  if (now.getMonth() >= 8) {
    data.startDate = new Date(now.getFullYear(), 0, 1);
    data.endDate = new Date(now.getFullYear() + 1, 0, 1);
    data.name = `${now.getFullYear()}-${now.getFullYear() + 1}`;
  } else {
    data.startDate = new Date(now.getFullYear() - 1, 0, 1);
    data.endDate = new Date(now.getFullYear(), 0, 1);
    data.name = `${now.getFullYear() - 1}-${now.getFullYear()}`;
  }

  return data;
};
