import React, { useState } from 'react';

const MenuButton = ({ text }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleClick = () => setIsClicked(!isClicked);

  const buttonStyle = {
    backgroundColor: isClicked ? 'white' : (isHovered ? '#841F1C' : '#C20E1A'),
    color: isClicked ? '#C20E1A' : 'white',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    border: 'none',
    padding: '10px 20px', // Ajusta el padding según necesites
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
    margin: '5px', // Margen para separar del resto
  };

  return (
    <button
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default MenuButton;
