import React from "react";

const Button = ({
  type = "button",
  onClick,
  children,
  disabled,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`py-2 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/60 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
