import PropTypes from "prop-types"

const Tables = ({ 
  rows = [[]], 
  columns = [],
  enableClassname = false,
  classNameContainer = ""
}) => {
  const headerStyle = {
    backgroundColor: '#CFCFCF', // Fondo gris oscuro
    color: 'black', // Texto negro
    fontSize: '16px', // Tamaño de texto
    padding: '8px',
    textAlign: 'center',
  };

  const cellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
  };

  const tableContainerStyle = {
    overflowX: 'auto', // Scroll horizontal para pantallas pequeñas
  };

  const tableStyle = {
    minWidth: '100%', // Para que ocupe todo el ancho disponible
    borderCollapse: 'collapse',
  };

  return (
    <div 
    style={ enableClassname ? {} : { textAlign: 'center' }}
    className={classNameContainer}>
      {/* Contenedor con scroll horizontal en pantallas pequeñas */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} style={headerStyle}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} style={cellStyle}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Tables.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.array),
  columns: PropTypes.array,
  enableClassname: PropTypes.bool,
  classNameContainer: PropTypes.string
}

export default Tables;

