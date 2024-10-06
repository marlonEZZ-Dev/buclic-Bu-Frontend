import React, { useState, useEffect } from 'react';
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import MenuBecas from "../../components/global/MenuBecas.jsx";
import SearchInput from '../../components/global/SearchInput.jsx';
import TablePagination from '../../components/global/TablePagination.jsx';
import { Button } from 'antd';
import { EyeOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';

const CombinedReports = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState([]);
  const itemsPerPage = 10;
  const [selectedType, setSelectedType] = useState("Diarios");
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const buttons = [
    { type: "Diarios", label: "Diarios" },
    { type: "Semestrales", label: "Semestrales" },
  ];

  const columnsDaily = ['Fecha generada', 'Beca', 'Acciones'];
  const columnsSemestral = ['Semestre', 'Beca', 'Acciones'];

  useEffect(() => {
    // Generate sample data based on the selected type
    const scholarshipTypes = ['Almuerzo', 'Refrigerio'];
    const semesterTypes = ['2024-1', '2024-2'];
    const generatedRows = Array.from({ length: 100 }, (_, index) => {
      if (selectedType === "Diarios") {
        return [
          new Date(Date.now() + index * 86400000).toLocaleDateString(),
          scholarshipTypes[index % scholarshipTypes.length],
          renderActions(index)
        ];
      } else {
        return [
          semesterTypes[index % semesterTypes.length],
          scholarshipTypes[index % scholarshipTypes.length],
          renderActions(index)
        ];
      }
    });
    setRows(generatedRows);
  }, [selectedType]);

  const renderActions = (index) => (
    <span key={index}>
      <Button icon={<EyeOutlined />} style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }} />
      <Button icon={<DownloadOutlined />} style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }} />
      <Button icon={<DeleteOutlined />} style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }} />
    </span>
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    // Aquí iría la lógica para filtrar los datos según el tipo de beca seleccionado
  };

  return (
    <>
      <HeaderAdmin />
      <div className="becas-section">
        <MenuBecas
          onSelect={setSelectedType}
          buttons={buttons}
          selectedType={selectedType}
        >
          <h2 style={{ color: '#C20E1A', marginBottom: 16, textAlign: 'center' }}>
            Informes {selectedType === "Diarios" ? "diarios" : "semestrales"}
          </h2>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '20px' }}>
            <SearchInput />
          </div>

          {/* Nuevos botones de filtro */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Button 
              onClick={() => handleFilterChange('Todos')}
              style={{ 
                marginRight: '10px', 
                backgroundColor: selectedFilter === 'Todos' ? '#C20E1A' : 'white',
                color: selectedFilter === 'Todos' ? 'white' : '#C20E1A',
                border: '1px solid #C20E1A'
              }}
            >
              Todos
            </Button>
            <Button 
              onClick={() => handleFilterChange('Almuerzo')}
              style={{ 
                marginRight: '10px', 
                backgroundColor: selectedFilter === 'Almuerzo' ? '#C20E1A' : 'white',
                color: selectedFilter === 'Almuerzo' ? 'white' : '#C20E1A',
                border: '1px solid #C20E1A'
              }}
            >
              Almuerzo
            </Button>
            <Button 
              onClick={() => handleFilterChange('Refrigerio')}
              style={{ 
                backgroundColor: selectedFilter === 'Refrigerio' ? '#C20E1A' : 'white',
                color: selectedFilter === 'Refrigerio' ? 'white' : '#C20E1A',
                border: '1px solid #C20E1A'
              }}
            >
              Refrigerio
            </Button>
          </div>
                    
          <TablePagination
            rows={rows}
            columns={selectedType === "Diarios" ? columnsDaily : columnsSemestral}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </MenuBecas>
      </div>
    </>
  );
};

export default CombinedReports;