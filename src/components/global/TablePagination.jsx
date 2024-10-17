import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const TablePagination = ({
    rows = [],
    columns = [],
    currentPage = 0,
    itemsPerPage = 0,
    onPageChange = () => { },
    onRowClick = () => { },
}) => {
    let isRowNull = rows === null
    const headerStyle = {
        backgroundColor: '#CFCFCF',
        color: 'black',
        fontSize: '1.125rem',
        padding: '8px',
        textAlign: 'center',
    };

    const cellStyle = {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'center',
    };

    // Calcular el índice de inicio y fin para la paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = isRowNull ? [] : rows.slice(indexOfFirstItem, indexOfLastItem); // Obtener los elementos actuales

    // Estilo para los botones
    const buttonStyle = {
        backgroundColor: '#FFFFFF',
        color: '#B3B3B3',
        border: 'none',
        height: '30px',
        flex: 1, // Permitir que el botón crezca
        margin: '0 5px', // Margen entre botones
        borderRadius: '8px',
        transition: 'background-color 0.3s',
        cursor: 'pointer',
    };

    // Estilo para el hover
    const buttonHoverStyle = {
        backgroundColor: '#E3DEDE',
    };

    // Estilo para la página actual
    const pageIndicatorStyle = {
        backgroundColor: '#C20E1A',
        color: '#FFFFFF',
        padding: '5px 10px',
        borderRadius: '8px',
        display: 'inline-block',
    };

    return (
        <div
            style={{ textAlign: 'center', margin: '20px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                    {currentItems.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            onClick={() => onRowClick(row)}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyle}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Paginación */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ ...buttonStyle, ...(currentPage === 1 ? { pointerEvents: 'none', opacity: 0.5 } : {}) }} // Desactiva el botón si está en la primera página
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor} // Cambiar color al entrar
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor} // Revertir color al salir
                >
                    <LeftOutlined /> Anterior
                </button>
                <div style={pageIndicatorStyle}> {currentPage}</div>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={indexOfLastItem >= (isRowNull ? 0 : rows.length)}
                    style={{ ...buttonStyle, ...(indexOfLastItem >= (isRowNull ? 0 : rows.length) ? { pointerEvents: 'none', opacity: 0.5 } : {}) }} // Desactiva el botón si no hay más elementos
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor} // Cambiar color al entrar
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor} // Revertir color al salir
                >
                    Siguiente <RightOutlined />
                </button>
            </div>
        </div>
    );
};

TablePagination.propTypes = {
    rows: PropTypes.array,
    columns: PropTypes.array,
    currentPage: PropTypes.number,
    itemsPerPage: PropTypes.number,
    onPageChange: PropTypes.func,
    onRowClick: PropTypes.func
}

export default TablePagination;