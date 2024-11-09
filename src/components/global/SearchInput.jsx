import { useState } from 'react';
import { Button, Input } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import PropTypes from "prop-types";

const SearchInput = ({ 
  placeholder = "Buscar", 
  onClick = () => {}, 
  onChange = () => {}, 
  onRefresh = () => {},  // Nueva prop para manejar el refresco
  ...props 
}) => {
  const [hover, setHover] = useState(false);
  

  const handleInputChange = (e) => {
    onChange(e);
  };

  return (
    <div style={styles.container}>
      <Input
        placeholder={placeholder}
        style={styles.input}
        onChange={handleInputChange}
        {...props}
      />
      <Button
        type="primary"
        icon={<SearchOutlined style={{ color: 'white' }} />}
        style={{
          ...styles.button,
          backgroundColor: hover ? '#841F1C' : '#C20E1A',
          borderColor: hover ? '#841F1C' : '#C20E1A'
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
      />
      <Button
        type="default"
        icon={<ReloadOutlined />}
        style={{
          ...styles.button,
          backgroundColor: hover ? '#841F1C' : '#C20E1A',
          borderColor: hover ? '#841F1C' : '#C20E1A',
          marginLeft: '10px',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onRefresh} // Llama a la función onRefresh al hacer clic
      >

      </Button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    maxWidth: '300px',
    marginRight: '10px',
  },
  button: {
    color: 'white',
  },
};

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onRefresh: PropTypes.func, // Nueva prop para manejar la función de refresco
};

export default SearchInput;
