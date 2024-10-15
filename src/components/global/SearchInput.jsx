import { useState } from 'react';
import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import PropTypes from "prop-types"

const SearchInput = ({ placeholder = "Buscar", onSearch, ...props }) => {
  const [hover, setHover] = useState(false);
  const [value, setValue] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={styles.container}>
      <Input
        placeholder={placeholder}
        style={styles.input}
        value={value}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        {...props}
      />

      <Button
        type="primary"
        icon={<SearchOutlined style={{ color: 'white' }} />}
        style={{ ...styles.button, backgroundColor: hover ? '#841F1C' : '#C20E1A', borderColor: hover ? '#841F1C' : '#C20E1A' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={handleSearch}
      />
    </div>
  );
};

// Estilos en línea
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
  onSearch: PropTypes.func,
}

export default SearchInput;