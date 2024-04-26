import { useContext } from 'react';
import { ToastDispatch } from '@/providers/toastProvider';

export const useToast = () => useContext(ToastDispatch);
