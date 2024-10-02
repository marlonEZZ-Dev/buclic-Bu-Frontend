import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const SchedulingTable = ({ headers, rows }) => {
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
    };

    const headerStyle = {
        backgroundColor: '#D9D9D9',
        color: '#000000',
        fontSize: '19px',
        padding: '10px',
        textAlign: 'center',
        border: '1px solid #CFCFCF',
    };

    const cellStyle = {
        padding: '10px',
        border: '1px solid #CFCFCF',
    };

    // Manejo del click del botón
    const handleSchedule = (row) => {
        console.log(`Agendar cita para: ${row[0]}`); // Puedes implementar tu lógica aquí
    };

    return (
        <table style={tableStyle}>
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} style={headerStyle}>
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} style={cellStyle}>
                                {cellIndex === 2 ? ( // Verifica si es la columna 'Agendar'
                                    <Button className="button-save" type="primary" onClick={() => handleSchedule(row)}>
                                        Agendar
                                    </Button>
                                ) : (
                                    cell
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

// Validación de las props
SchedulingTable.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default SchedulingTable;