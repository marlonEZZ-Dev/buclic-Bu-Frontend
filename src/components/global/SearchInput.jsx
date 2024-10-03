import { useState } from 'react';
import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import PropTypes from "prop-types"

const SearchInput = ({placeholder="Buscar"}) => {
  const [hover, setHover] = useState(false);

  return (
    <div style={styles.container}>
      {/* Campo de entrada */}
      <Input
        placeholder={placeholder}
        style={styles.input}
      />

      {/* Botón de buscar con lupa */}
      <Button
        type="primary"
        icon={<SearchOutlined style={{ color: 'white' }} />}
        style={{ ...styles.button, backgroundColor: hover ? '#841F1C' : '#C20E1A', borderColor: hover ? '#841F1C' : '#C20E1A' }}
        onMouseEnter={() => setHover(true)}  // Cuando el mouse está sobre el botón
        onMouseLeave={() => setHover(false)} // Cuando el mouse sale del botón
      >
      </Button>
    </div>
  );
};

// Estilos en línea
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Centrar horizontalmente
    flexWrap: 'wrap', // Permitir que los elementos se ajusten en diferentes líneas si es necesario
  },
  input: {
    flex: 1, // Permite que el input ocupe el espacio disponible
    maxWidth: '300px', // Ancho máximo para pantallas grandes
    marginRight: '10px', // Espacio entre el input y el botón
  },
  button: {
    color: 'white',
  },
};

SearchInput.propTypes = {
  placeholder : PropTypes.string
}

export default SearchInput;
