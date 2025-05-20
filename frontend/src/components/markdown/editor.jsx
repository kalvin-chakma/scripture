'use client'
import React from 'react';
export default function Editor({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-full p-2 border resize-none font-mono text-sm"
    />
  );
}
