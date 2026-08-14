import { toast as reactToast, type ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  autoClose: 3000,
  closeOnClick: true,
  draggable: true,
  hideProgressBar: false,
  pauseOnHover: true,
};

export const notify = {
  error: (message: string, options?: ToastOptions) => {
    return reactToast.error(message, {
      ...defaultOptions,
      toastId: message,
      ...options,
    });
  },
  info: (message: string, options?: ToastOptions) => {
    return reactToast.info(message, {
      ...defaultOptions,
      toastId: message,
      ...options,
    });
  },
  success: (message: string, options?: ToastOptions) => {
    return reactToast.success(message, {
      ...defaultOptions,
      toastId: message,
      ...options,
    });
  },
  warning: (message: string, options?: ToastOptions) => {
    return reactToast.warning(message, {
      ...defaultOptions,
      toastId: message,
      ...options,
    });
  },
};
