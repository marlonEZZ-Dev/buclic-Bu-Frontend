import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SchedulingTable = ({ headers, rows }) => {
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
    };

    const headerStyle = {
        backgroundColor: '#841F1C',
        color: 'white',
        fontSize: '19px',
        padding: '10px',
        textAlign: 'left',
        border: '1px solid #CFCFCF',
    };

    const cellStyle = {
        padding: '10px',
        border: '1px solid #CFCFCF',
    };

    return (
        <table style={tableStyle}>
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} style={headerStyle}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} style={cellStyle}>{cell}</td>
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
