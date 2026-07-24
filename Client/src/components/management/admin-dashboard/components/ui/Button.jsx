import React from 'react';

const variants = {
  primary: "bg-amber-600 hover:bg-amber-700 text-white",
  secondary: "bg-slate-600 hover:bg-slate-700 text-white",
  info: "bg-blue-600 hover:bg-blue-700 text-white",
  infoLight: "bg-blue-500 hover:bg-blue-600 text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white"
};

const sizes = {
  sm: "px-3 py-1 rounded text-sm",
  md: "px-4 py-2 rounded-lg",
  flex: "flex-1 py-2 rounded-lg"
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const baseStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${sizeStyle} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};
