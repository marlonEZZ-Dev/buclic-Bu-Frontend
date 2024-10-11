import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const TablePaginationUsers = ({ 
    rows = [], 
    columns = [],
    currentPage = 1, 
    itemsPerPage = 10, 
    onPageChange = () => {}, 
    onCellClick = () => {}, 
}) => {
    const isRowNull = !Array.isArray(rows) || rows === null;
    const safeRows = isRowNull ? [] : rows;

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

    const buttonStyle = {
        backgroundColor: '#FFFFFF',
        color: '#B3B3B3',
        border: 'none',
        height: '30px',
        flex: 1,
        margin: '0 5px',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const pageIndicatorStyle = {
        backgroundColor: '#C20E1A',
        color: '#FFFFFF',
        padding: '5px 10px',
        borderRadius: '8px',
        display: 'inline-block',
    };

    // Pagination logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = safeRows.slice(startIndex, endIndex);

    return (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th 
                                key={`header-${column.key || index}`}
                                style={headerStyle}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((row, rowIndex) => (
                        <tr key={`row-${rowIndex}`}>
                            {columns.map((column, colIndex) => {
                                const cellContent = row[column.key];
                                const isEditCell = column.key === 'edit';
                                
                                return (
                                    <td 
                                        key={`cell-${rowIndex}-${colIndex}`}
                                        style={cellStyle}
                                        onClick={isEditCell ? () => onCellClick(row) : undefined}
                                        role={isEditCell ? 'button' : undefined}
                                    >
                                        {cellContent}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button 
                    onClick={() => onPageChange(currentPage - 1)} 
                    disabled={currentPage <= 1}
                    style={{ 
                        ...buttonStyle, 
                        ...(currentPage <= 1 ? { pointerEvents: 'none', opacity: 0.5 } : {}) 
                    }}
                >
                    <LeftOutlined /> Anterior
                </button>
                <div style={pageIndicatorStyle}>{currentPage}</div>
                <button 
                    onClick={() => onPageChange(currentPage + 1)} 
                    disabled={endIndex >= safeRows.length}
                    style={{ 
                        ...buttonStyle, 
                        ...(endIndex >= safeRows.length ? { pointerEvents: 'none', opacity: 0.5 } : {}) 
                    }}
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
