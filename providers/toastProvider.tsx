'use client';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { createContext, useEffect, useState } from 'react';
import { default as Notification } from '@/components/Common/Toast';
import type {
  Dispatch,
  FC,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
} from 'react';

type ToastContextType = {
  message: string | ReactNode;
  duration?: number;
  kind?: 'info' | 'success' | 'error' | 'warning';
} | null;

type ToastProps = { viewportClassName?: string };

const ToastContext = createContext<ToastContextType>(null);

export const ToastDispatch = createContext<
  Dispatch<SetStateAction<ToastContextType>>
>(() => {});

export const ToastProvider: FC<PropsWithChildren<ToastProps>> = ({
  viewportClassName,
  children,
}) => {
  const [toast, dispatch] = useState<ToastContextType>(null);

  useEffect(() => {
    const timeout = setTimeout(() => dispatch(null), toast?.duration ?? 5000);

    return () => clearTimeout(timeout);
  }, [toast]);

  return (
    <ToastContext.Provider value={toast}>
      <ToastDispatch.Provider value={dispatch}>
        <ToastPrimitive.Provider>
          {children}
          <ToastPrimitive.Viewport className={viewportClassName} />
          {toast && (
            <Notification duration={toast.duration} kind={toast.kind}>
              {toast.message}
            </Notification>
          )}
        </ToastPrimitive.Provider>
      </ToastDispatch.Provider>
    </ToastContext.Provider>
  );
};
