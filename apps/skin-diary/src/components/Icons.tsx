import React from 'react';

// Material Symbols wrapper for filled icons
interface MaterialIconProps {
  name: string;
  filled?: boolean;
  size?: number;
  className?: string;
}

export function MaterialIcon({ name, filled, size, className = '' }: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: filled ? "'FILL' 1, 'wght' 300" : undefined,
        fontSize: size ? `${size}px` : undefined,
      }}
    >
      {name}
    </span>
  );
}
