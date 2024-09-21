import React from 'react';

const IconCircle = ({ icon, text, size = 64, bgColor = 'bg-gray-200', iconSize }) => {
  const sizes = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 64,
    xl: 80,
    xxl: 100,
    '2xl': 240,
  };

  const actualSize = sizes[size] || size;
  const calculatedIconSize = iconSize || `w-${Math.floor(actualSize * 0.5)} h-${Math.floor(actualSize * 0.5)}`;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex items-center justify-center rounded-full ${bgColor}`}
        style={{
          width: `${actualSize}px`,
          height: `${actualSize}px`,
          borderRadius: '50%',
          backgroundColor: '#e2e8f0',
        }}
      >
        <div className={`flex items-center justify-center ${calculatedIconSize}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          {icon}
        </div>
      </div>
      {text && (
        <span className="mt-2 text-sm text-center font-medium">
          {text}
        </span>
      )}
    </div>
  );
};

export default IconCircle;