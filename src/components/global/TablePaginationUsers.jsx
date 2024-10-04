import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const TablePaginationUsers = ({ 
    rows = [], 
    columns = [], // Este será un array de objetos que define qué propiedades del objeto se deben mostrar en la tabla.
    currentPage = 0, 
    itemsPerPage = 0, 
    onPageChange = () => {}, 
    onCellClick = () => {}, 
}) => {
    const isRowNull = rows === null;

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
    const currentItems = isRowNull ? [] : rows.slice(indexOfFirstItem, indexOfLastItem); 

    // Estilo para los botones
    const buttonStyle = {
        backgroundColor: '#FFFFFF',
        color: '#B3B3B3',
        border: 'none',
        height: '30px',
        flex: 1,
        margin: '0 5px',
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
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        {columns.map(({ label }, index) => (
                            <th key={index} style={headerStyle}>
                                {label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map(({ key }, cellIndex) => (
                                <td 
                                key={cellIndex} 
                                style={cellStyle} 
                                onClick={() => key === "edit" ? onCellClick(row) : {}}>
                                    {row[key]} {/* Mostrar el valor correspondiente a la clave de la columna */}
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
                    style={{ ...buttonStyle, ...(currentPage === 1 ? { pointerEvents: 'none', opacity: 0.5 } : {}) }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                >
                    <LeftOutlined /> Anterior
                </button>
                <div style={pageIndicatorStyle}> {currentPage} </div>
                <button 
                    onClick={() => onPageChange(currentPage + 1)} 
                    disabled={indexOfLastItem >= (isRowNull ? 0 : rows.length)}
                    style={{ ...buttonStyle, ...(indexOfLastItem >= (isRowNull ? 0 : rows.length) ? { pointerEvents: 'none', opacity: 0.5 } : {}) }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                >
                    Siguiente <RightOutlined />
                </button>
            </div>
        </div>
    );
};

TablePaginationUsers.propTypes = {
    rows : PropTypes.arrayOf(PropTypes.object), // Arreglo de objetos
    columns : PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired, // Clave que indica qué propiedad del objeto mostrar
        label: PropTypes.string.isRequired // Etiqueta que se muestra en la cabecera
    })).isRequired, 
    currentPage : PropTypes.number,
    itemsPerPage: PropTypes.number,
    onPageChange : PropTypes.func,
    onCellClick : PropTypes.func, 
}

export default TablePaginationUsers;
