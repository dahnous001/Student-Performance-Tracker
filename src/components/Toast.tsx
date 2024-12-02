import { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export default function Toast({ message, type }: ToastProps) {
  useEffect(() => {
    // Prevent body scroll when toast is shown
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div 
      role="alert"
      aria-live="assertive"
      className={`fixed bottom-4 right-4 ${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50`}
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
      <span className="font-medium">{message}</span>
    </div>
  );
}