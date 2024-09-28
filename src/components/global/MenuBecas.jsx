import { useState } from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types'

/*
- bordered: This add or not a Divider under title in the Card, its type is boolean
- buttons: This add the quantity of buttons should set it with one or more objects that contain two porperties 
  type and label with strings, its type is a list
- childrem: This property is descendant, in other words MenuBecas should be contained others components
- onSelect: This modify the type of button when is clicked the specificed button, its type is a function
- selectedTyped: This change title in a Card, its type is string
*/

const MenuBecas = ({ bordered, buttons, children, onSelect, selectedType }) => {
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
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      {/* Botones */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {buttons.map((button) => (
          <button
            key={button.type}
            style={{ ...buttonStyle, ...(selected === button.type ? activeStyle : {}) }}
            onClick={() => handleClick(button.type)}
          >
            {button.label}
          </button>
        ))}
      </div>

      {/* Card */}
      <Card
        title={selectedType}  // Título dinámico basado en el tipo seleccionado
        bordered={bordered}
        style={{ width: '600px', marginTop: '0' }}
      >
        {children} {/* Contenido dinámico: tablas, inputs, texto, etc. */}
        
      </Card>
    </div>
  );
};

MenuBecas.propTypes = {
  bordered: PropTypes.bool,
  buttons: PropTypes.array,
  children: PropTypes.node,
  onSelect: PropTypes.func,
  selectedType: PropTypes.string
}

export default MenuBecas;
