import React, { useState } from 'react';

const MenuBecas = ({ onSelect }) => {
  const [selected, setSelected] = useState('');

  const handleClick = (type) => {
    setSelected(type);
    onSelect(type); // Llama a la función de callback
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '0 5px',
    backgroundColor: '#C20E1A',
    color: 'white',
    border: '2px solid #C20E1A',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  };

  const activeStyle = {
    backgroundColor: 'white',
    color: '#C20E1A',
    border: '2px solid white',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button
        style={{ ...buttonStyle, ...(selected === 'almuerzo' ? activeStyle : {}) }}
        onClick={() => handleClick('almuerzo')}
      >
        Almuerzo
      </button>
      <button
        style={{ ...buttonStyle, ...(selected === 'refrigerio' ? activeStyle : {}) }}
        onClick={() => handleClick('refrigerio')}
      >
        Refrigerio
      </button>
    </div>
  );
};

export default MenuBecas;

