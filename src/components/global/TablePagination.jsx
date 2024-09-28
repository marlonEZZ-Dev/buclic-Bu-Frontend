import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const TablePagination = ({ rows, columns, currentPage, itemsPerPage, onPageChange }) => {
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
    const currentItems = rows.slice(indexOfFirstItem, indexOfLastItem); // Obtener los elementos actuales

    // Estilo para los botones
    const buttonStyle = {
        backgroundColor: '#FFFFFF',   // Fondo blanco
        color: '#B3B3B3',             // Texto gris claro
        border: 'none',                // Sin borde
        height: '30px',                // Altura
        width: '149px',                // Ancho
        fontSize: '16px',              // Tamaño de fuente
        cursor: 'pointer',             // Cursor pointer
        margin: '0 5px',               // Margen entre botones
        borderRadius: '8px',           // Esquinas redondeadas
        transition: 'background-color 0.3s', // Transición suave
    };

    // Estilo para el hover
    const buttonHoverStyle = {
        backgroundColor: '#E3DEDE',   // Color de fondo al pasar el mouse
    };

    // Estilo para la página actual
    const pageIndicatorStyle = {
        backgroundColor: '#C20E1A',  // Fondo rojo
        color: '#FFFFFF',             // Texto blanco
        padding: '5px 10px',         // Espaciado interno
        borderRadius: '8px',          // Esquinas redondeadas
        display: 'inline-block',      // Para que el fondo se ajuste al contenido
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
                    {currentItems.map((row, rowIndex) => (
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

            {/* Paginación */}
            <div style={{ marginTop: '20px' }}>
                <button 
                    onClick={() => onPageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    style={{ ...buttonStyle, ...(currentPage === 1 ? { pointerEvents: 'none' } : {}) }} // Desactiva el botón si está en la primera página
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor} // Cambiar color al entrar
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor} // Revertir color al salir
                >
                    <LeftOutlined /> Anterior
                </button>
                <div style={pageIndicatorStyle}> {currentPage}</div>
                <button 
                    onClick={() => onPageChange(currentPage + 1)} 
                    disabled={indexOfLastItem >= rows.length}
                    style={{ ...buttonStyle, ...(indexOfLastItem >= rows.length ? { pointerEvents: 'none' } : {}) }} // Desactiva el botón si no hay más elementos
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor} // Cambiar color al entrar
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor} // Revertir color al salir
                >
                    Siguiente <RightOutlined />
                </button>
            </div>
        </div>
    );
};

export default TablePagination;
