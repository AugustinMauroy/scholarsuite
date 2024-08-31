'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  PencilIcon,
  CheckCircleIcon,
  TriangleAlertIcon,
  PlusIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '@/components/Common/Button';
import EditModal from '@/components/Common/EditModal';
import Input from '@/components/Common/Input';
import { useToast } from '@/hooks/useToast';
import { isValidTimeRange, isValidTime } from '@/utils/timeslot';
import type { TimeSlot } from '@prisma/client';
import type { FC } from 'react';

const Table: FC = () => {
  const toast = useToast();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [validTimeRange, setValidTimeRange] = useState(true);
  const [validStartTime, setValidStartTime] = useState(true);
  const [validEndTime, setValidEndTime] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [timeSlotId, setTimeSlotId] = useState<number>();
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    fetch('/api/timeSlot')
      .then(res => res.json())
      .then(({ data }) => setTimeSlots(data));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (startTime.length > 0 && endTime.length > 0)
        setValidTimeRange(isValidTimeRange(startTime, endTime));
      if (startTime.length > 0) setValidStartTime(isValidTime(startTime));
      if (endTime.length > 0) setValidEndTime(isValidTime(endTime));

      if (startTime.length === 0) setValidStartTime(true);
      if (endTime.length === 0) setValidEndTime(true);
    }, 500);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const handleAdd = async () => {
    if (!startTime || !endTime) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            Time slot cannot be empty
          </>
        ),
        kind: 'error',
      });

      return;
    }
    if (!validEndTime || !validStartTime || !validTimeRange) return;

    const timeSlot = await fetch('/api/timeSlot', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        startTime,
        endTime,
      }),
    }).then(res => res.json());

    if (timeSlot.error) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            {timeSlot.error}
          </>
        ),
        kind: 'error',
      });

      return;
    }

    setTimeSlots([...timeSlots, timeSlot.data]);
    setName('');
    setStartTime('');
    setEndTime('');
    setIsAdding(false);
    toast({
      message: (
        <>
          <CheckCircleIcon />
          Time slot added
        </>
      ),
      kind: 'success',
    });
  };

  const handleEdit = async () => {
    if (!startTime || !endTime) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            Time slot cannot be empty
          </>
        ),
        kind: 'error',
      });

      return;
    }
    if (!validEndTime || !validStartTime || !validTimeRange) return;

    const timeSlot = await fetch('/api/timeSlot', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: timeSlotId,
        name,
        startTime,
        endTime,
      }),
    }).then(res => res.json());

    if (timeSlot.error) {
      toast({
        message: (
          <>
            <TriangleAlertIcon />
            {timeSlot.error}
          </>
        ),
        kind: 'error',
      });

      return;
    }

    setTimeSlots(timeSlots.map(t => (t.id === timeSlotId ? timeSlot.data : t)));
    setName('');
    setStartTime('');
    setEndTime('');
    setTimeSlotId(undefined);
    toast({
      message: (
        <>
          <CheckCircleIcon />
          Time slot updated
        </>
      ),
      kind: 'success',
    });
  };

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <Button
          kind="outline"
          onClick={() => setIsAdding(true)}
          className="mb-4"
        >
          <PlusIcon />
          Add Time Slot
        </Button>
      </DialogPrimitive.Trigger>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(timeSlot => (
            <tr key={timeSlot.id}>
              <td>
                {timeSlot?.name ??
                  `${timeSlot.startTime} - ${timeSlot.endTime}`}
              </td>
              <td>{timeSlot.startTime}</td>
              <td>{timeSlot.endTime}</td>
              <td>
                <DialogPrimitive.Trigger asChild>
                  <Button
                    onClick={() => {
                      setName(timeSlot.name ?? '');
                      setStartTime(timeSlot.startTime);
                      setEndTime(timeSlot.endTime);
                      setTimeSlotId(timeSlot.id);
                    }}
                  >
                    <PencilIcon />
                    Edit
                  </Button>
                </DialogPrimitive.Trigger>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditModal
        title={isAdding ? 'Add Time Slot' : 'Edit TimeSlot'}
        onClose={() => setIsAdding(false)}
      >
        {(!validStartTime || !validEndTime || !validTimeRange) && (
          <div className="color-red-600 dark:color-red-100 mb-4 rounded border border-red-400 bg-red-100 p-2 dark:border-red-600 dark:bg-red-500">
            <TriangleAlertIcon />
            {(!validStartTime || !validEndTime) && (
              <p>The correct format is HH:MM</p>
            )}
            {!validStartTime && <p>Invalid Start Time</p>}
            {!validEndTime && <p>Invalid End Time</p>}
            {!validTimeRange && (
              <p>
                Invalid Time Range (Start Time should be less than End Time)
              </p>
            )}
          </div>
        )}
        <Input
          type="text"
          name="name"
          id="name"
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Input
          type="text"
          name="startTime"
          id="startTime"
          label="Start Time"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
        />
        <Input
          type="text"
          name="endTime"
          id="endTime"
          label="End Time"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
        />
        <Button
          kind="outline"
          onClick={() => (isAdding ? handleAdd() : handleEdit())}
        >
          Save
        </Button>
      </EditModal>
    </DialogPrimitive.Root>
  );
};

export default Table;
