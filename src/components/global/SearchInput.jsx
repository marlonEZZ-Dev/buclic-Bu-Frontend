import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchInput = () => {
  const [hover, setHover] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* Campo de entrada */}
      <Input
        placeholder="Buscar"
        style={{ width: '300px', marginRight: '10px' }}
      />

      {/* Botón de buscar con lupa */}
      <Button
        type="primary"
        icon={<SearchOutlined style={{ color: 'white' }} />}
        style={{
          backgroundColor: hover ? '#841F1C' : '#C20E1A',  // Cambiar el color cuando hover es true
          borderColor: hover ? '#841F1C' : '#C20E1A',     // Cambiar el borde también
          color: 'white',  
        }}
        onMouseEnter={() => setHover(true)}  // Cuando el mouse está sobre el botón
        onMouseLeave={() => setHover(false)} // Cuando el mouse sale del botón
      >
      </Button>
    </div>
  );
};

export default SearchInput;
