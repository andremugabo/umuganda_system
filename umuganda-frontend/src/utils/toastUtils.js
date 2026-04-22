import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Default configuration for consistent look and feel
const defaultOptions = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
};

export const showSuccess = (message) => {
    toast.success(message, defaultOptions);
};

export const showError = (message) => {
    toast.error(message, defaultOptions);
};

export const showInfo = (message) => {
    toast.info(message, defaultOptions);
};

export const showWarning = (message) => {
    toast.warning(message, defaultOptions);
};

// Generic toaster for custom uses
export const showToast = (message, type = 'default') => {
    if (toast[type]) {
        toast[type](message, defaultOptions);
    } else {
        toast(message, defaultOptions);
    }
};
