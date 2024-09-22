// MenuBecas.jsx
import React, { useState } from 'react';

const MenuBecas = () => {
  const [selected, setSelected] = useState('');

  const handleClick = (type) => {
    setSelected(type);
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '0 5px',
    backgroundColor: 'white',
    color: '#C20E1A',
    border: '2px solid #C20E1A',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
  };

  const activeStyle = {
    backgroundColor: '#C20E1A',
    color: 'white',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
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
