import React from 'react';

export const Modal = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          {onClose && (
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
              &times;
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
