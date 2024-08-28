import prisma from '@/lib/prisma';
import type { TimeSlot } from '@prisma/client';

export const GET = async (req: Request): Promise<Response> => {
  const timeSlots = await prisma.timeSlot.findMany();

  return Response.json({
    data: timeSlots,
  });
};

export const PUT = async (req: Request): Promise<Response> => {
  const { name, startTime, endTime } = (await req.json()) as TimeSlot;

  // timeSlot should be XX:XX min is 00:00 max is 23:59
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!regex.test(startTime) || !regex.test(endTime)) {
    return Response.json({
      error: 'Invalid time format',
    });
  }

  // check if time slot is possible start time is less than end time
  if (startTime >= endTime) {
    return Response.json({
      error: 'Invalid time slot range',
    });
  }

  // check if time slot overlap
  const timeSlots = await prisma.timeSlot.findMany();
  const isTimeSlotOverlap = timeSlots.some(
    timeSlot => endTime > timeSlot.startTime && endTime < timeSlot.endTime
  );

  if (isTimeSlotOverlap) {
    return Response.json({
      error: 'Time slot overlap',
    });
  }

  const timeSlot = await prisma.timeSlot.create({
    data: {
      // @TOD: implement timeSlotGroupId
      timeSlotGroupId: 1,
      name,
      startTime,
      endTime,
    },
  });

  return Response.json({
    data: timeSlot,
  });
};

export const PATCH = async (req: Request): Promise<Response> => {
  const { id, name, startTime, endTime } = (await req.json()) as TimeSlot;

  // timeSlot should be XX:XX min is 00:00 max is 23:59
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!regex.test(startTime) || !regex.test(endTime)) {
    return Response.json({
      error: 'Invalid time format',
    });
  }

  // check if time slot is possible start time is less than end time
  if (startTime >= endTime) {
    return Response.json({
      error: 'Invalid time slot range',
    });
  }

  // check if time slot overlap
  const timeSlots = await prisma.timeSlot.findMany();
  const isTimeSlotOverlap = timeSlots.some(
    timeSlot => endTime > timeSlot.startTime && endTime <= timeSlot.endTime
  );

  if (isTimeSlotOverlap) {
    return Response.json({
      error: 'Time slot overlap',
    });
  }

  const timeSlot = await prisma.timeSlot.update({
    where: { id },
    data: {
      name,
      startTime,
      endTime,
    },
  });

  return Response.json({
    data: timeSlot,
  });
};
