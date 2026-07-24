import React from 'react';

export const Textarea = ({ label, id, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className="w-full p-2 border border-slate-300 rounded-lg"
        {...props}
      />
    </div>
  );
};
