'use client';
import {
  PencilIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from '@heroicons/react/24/solid';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';
import Button from '@/components/Common/Button';
import EditModal from '@/components/Common/EditModal';
import Input from '@/components/Common/Input';
import { useToast } from '@/hooks/useToast';
import type { TimeSlot } from '@prisma/client';
import type { FC } from 'react';

// timeSlot should be XX:XX min is 00:00 max is 23:59
const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const Table: FC = () => {
  const toast = useToast();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
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

  const handleAdd = async () => {
    if (!startTime || !endTime) {
      toast({
        message: (
          <>
            <ExclamationTriangleIcon />
            Time slot cannot be empty
          </>
        ),
        kind: 'error',
      });

      return;
    }
    if (!regex.test(startTime) || !regex.test(endTime)) {
      toast({
        message: (
          <>
            <ExclamationTriangleIcon />
            Invalid time format
          </>
        ),
        kind: 'error',
      });

      return;
    }

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
            <ExclamationTriangleIcon />
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
            <ExclamationTriangleIcon />
            Time slot cannot be empty
          </>
        ),
        kind: 'error',
      });

      return;
    }
    if (!regex.test(startTime) || !regex.test(endTime)) {
      toast({
        message: (
          <>
            <ExclamationTriangleIcon />
            Invalid time format
          </>
        ),
        kind: 'error',
      });

      return;
    }

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
            <ExclamationTriangleIcon />
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
