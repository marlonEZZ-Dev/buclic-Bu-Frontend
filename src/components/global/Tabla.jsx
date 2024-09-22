// Tabla.jsx
import React from 'react';

const Tabla = ({ rows, columns }) => {
  const headerStyle = {
    backgroundColor: '#CFCFCF', // Fondo gris oscuro
    color: 'black', // Texto blanco
    fontSize: '1.125rem', // 18px
    padding: '8px',
    textAlign: 'center',
  };

  const cellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
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
  );
};

export default Tabla;

