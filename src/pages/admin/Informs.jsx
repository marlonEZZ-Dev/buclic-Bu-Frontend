import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import { EyeOutlined, DownloadOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import MenuBecas from "../../components/global/MenuBecas.jsx";
import SearchInput from '../../components/global/SearchInput.jsx';
import TablePagination from '../../components/global/TablePagination.jsx';
import Modal from '../../components/global/Modal.jsx'; // Asumiendo que este es el path correcto para su componente Modal personalizado

const CombinedReports = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState([]);
  const itemsPerPage = 10;
  const [selectedType, setSelectedType] = useState("Diarios");
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  const buttons = [
    { type: "Diarios", label: "Diarios" },
    { type: "Semestrales", label: "Semestrales" },
  ];

  const columnsDaily = ['Fecha generado', 'Beca', 'Acciones'];
  const columnsSemestral = ['Beca', 'Semestre', 'Acciones'];

  useEffect(() => {
    // Generate sample data based on the selected type
    const scholarshipTypes = ['Almuerzo', 'Refrigerio'];
    const semesterTypes = ['2023-2', '2024-1'];
    const generatedRows = Array.from({ length: 100 }, (_, index) => {
      if (selectedType === "Diarios") {
        return [
          new Date(Date.now() + index * 86400000).toLocaleDateString(),
          scholarshipTypes[index % scholarshipTypes.length],
          renderActions(index)
        ];
      } else {
        return [
          scholarshipTypes[index % scholarshipTypes.length],
          semesterTypes[index % semesterTypes.length],
          renderActions(index)
        ];
      }
    });
    setRows(generatedRows);
  }, [selectedType]);

  const showDeleteConfirm = (index) => {
    setReportToDelete(index);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    // Aquí iría la lógica para eliminar el informe
    console.log(`Eliminando informe ${reportToDelete}`);
    setIsDeleteModalVisible(false);
    setReportToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setReportToDelete(null);
  };

  const renderActions = (index) => (
    <span key={index}>
      <Button icon={<EyeOutlined />} style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }} />
      <Button icon={<DownloadOutlined />} style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }} />
      <Button icon={<DeleteOutlined />} style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }} onClick={() => showDeleteConfirm(index)} />
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

          {selectedType === "Diarios" ? (
            <>
              <p style={{ textAlign: 'center' }}>
                Aquí puedes generar los informes diarios de las becas de alimentación
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Button
                  style={{
                    marginRight: '10px',
                    backgroundColor: selectedFilter === 'Almuerzo' ? '#C20E1A' : 'white',
                    color: selectedFilter === 'Almuerzo' ? 'white' : '#C20E1A',
                    border: '1px solid #C20E1A'
                  }}
                  onClick={() => handleFilterChange('Almuerzo')}
                >
                  Almuerzo
                </Button>
                <Button
                  style={{
                    backgroundColor: selectedFilter === 'Refrigerio' ? '#C20E1A' : 'white',
                    color: selectedFilter === 'Refrigerio' ? 'white' : '#C20E1A',
                    border: '1px solid #C20E1A'
                  }}
                  onClick={() => handleFilterChange('Refrigerio')}
                >
                  Refrigerio
                </Button>
              </div>
              <p style={{ textAlign: 'center' }}>
                Aquí puedes buscar los informes diarios generados a través de la fecha
              </p>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '20px' }}>
                <SearchInput />
              </div>
            </>
          ) : (
            <>
              <p style={{ textAlign: 'center' }}>
                Para generar los informes semestrales debes ingresar el semestre y seleccionar la beca
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Input placeholder="Semestre informe ej: 2024-2" style={{ width: 200, marginRight: '10px' }} />
                <Button
                  style={{
                    marginRight: '10px',
                    backgroundColor: selectedFilter === 'Almuerzo' ? '#C20E1A' : 'white',
                    color: selectedFilter === 'Almuerzo' ? 'white' : '#C20E1A',
                    border: '1px solid #C20E1A'
                  }}
                  onClick={() => handleFilterChange('Almuerzo')}
                >
                  Almuerzo
                </Button>
                <Button
                  style={{
                    backgroundColor: selectedFilter === 'Refrigerio' ? '#C20E1A' : 'white',
                    color: selectedFilter === 'Refrigerio' ? 'white' : '#C20E1A',
                    border: '1px solid #C20E1A'
                  }}
                  onClick={() => handleFilterChange('Refrigerio')}
                >
                  Refrigerio
                </Button>
              </div>
              <p style={{ textAlign: 'center' }}>
                Aquí puedes buscar los informes semestrales generados a través del semestre
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Input placeholder="Semestre informe" style={{ width: 200, marginRight: '10px' }} />
                <Button icon={<SearchOutlined />} style={{ backgroundColor: '#C20E1A', color: 'white' }} />
              </div>
            </>
          )}

          <TablePagination
            rows={rows}
            columns={selectedType === "Diarios" ? columnsDaily : columnsSemestral}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />

          <Modal
            open={isDeleteModalVisible}
            onClose={handleDeleteCancel}
            modalTitle="Confirmar eliminación"
          >
            <p>¿Desea eliminar el informe diario Almuerzo #{reportToDelete}?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button onClick={handleDeleteCancel} style={{ marginRight: '10px' }}>
                Cancelar
              </Button>
              <Button onClick={handleDeleteConfirm} type="primary" danger>
                Aceptar
              </Button>
            </div>
          </Modal>
        </MenuBecas>
      </div>
    </>
  );
};

export default CombinedReports;