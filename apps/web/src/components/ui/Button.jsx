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
      className={`py-2 rounded-lg font-medium transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
