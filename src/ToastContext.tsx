import { useMemo , useState, useContext, useCallback, createContext } from 'react';

import { Alert, Snackbar } from '@mui/material';

// Toast 状态管理
type ToastContextType = {
  showToast: (message: string, severity: 'success' | 'error') => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 手动声明 children 类型为 React.ReactNode
interface ToastProviderProps {
  children: React.ReactNode;
}

// ToastProvider 提供给整个应用的 Context
export function ToastProvider({ children }:ToastProviderProps){
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');

  const showToast = useCallback((text: string, type: 'success' | 'error') => {
    setMessage(text);
    setSeverity(type);
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  // 使用 useMemo 来缓存 context 值，避免每次渲染时都创建新的对象
  const contextValue = useMemo<ToastContextType>(() => ({
    showToast,
  }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

// 使用 hook 获取 showToast 函数
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
