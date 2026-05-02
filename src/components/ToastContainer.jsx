import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const ToastContainer = () => {
  const { toasts } = useContext(AppContext);

  return (
    <div className='fixed bottom-4 right-4 z-[100] flex flex-col gap-2'>
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className='bg-black/80 text-white font-bold py-3 px-6 rounded-lg shadow-2xl animate-fade-in-up'
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
