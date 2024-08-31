// timeSlot should be XX:XX min is 00:00 max is 23:59
const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const isValidTime = (name: string) => {
  return regex.test(name);
};

export const isValidTimeRange = (startTime: string, endTime: string) => {
  const start =
    parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
  const end =
    parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

  return start < end;
};
