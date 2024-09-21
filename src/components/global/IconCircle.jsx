import React, { useState } from 'react';

const IconCircle = ({ icon, text, size = 64, bgColor = 'bg-gray-200', iconSize }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizes = {
    
    xxl: 180,
    '2xl': 240,
  };

  const actualSize = sizes[size] || size;
  const calculatedIconSize = iconSize || `w-${Math.floor(actualSize * 0.5)} h-${Math.floor(actualSize * 0.5)}`;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex items-center justify-center rounded-full ${bgColor} transition-colors duration-300`}
        style={{
          width: `${actualSize}px`,
          height: `${actualSize}px`,
          borderRadius: '50%',
          backgroundColor: isHovered ? '#C20E1A' : '#e2e8f0',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)', // Añadimos la sombra aquí
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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