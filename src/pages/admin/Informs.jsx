import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, message } from 'antd';
import { EyeOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import MenuBecas from "../../components/global/MenuBecas.jsx";
import SearchInput from '../../components/global/SearchInput.jsx';
import TablePagination from '../../components/global/TablePagination.jsx';
import Modal from '../../components/global/Modal.jsx';
import api from '../../api';


const CombinedReports = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedType, setSelectedType] = useState("Diarios");
  const [selectedBeca, setSelectedBeca] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [semesterInput, setSemesterInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 10;
  const buttons = [
    { type: "Diarios", label: "Diarios" },
    { type: "Semestrales", label: "Semestrales" },
  ];
  const columnsDaily = ['Fecha generado', 'Beca', 'Acciones'];
  const columnsSemestral = ['Beca', 'Semestre', 'Acciones'];

  useEffect(() => {
    setSelectedBeca(null);
    setSemesterInput('');
    setSearchTerm('');
  }, [selectedType]);

  useEffect(() => {
    const filtered = rows.filter(row =>
      row.some(cell => cell.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRows(filtered);
  }, [searchTerm, rows]);

  const generateReport = useCallback(async (beca) => {
    if (selectedType === "Semestrales" && !semesterInput) {
      message.warning('Por favor, ingrese un semestre antes de generar el informe.');
      return;
    }

    setSelectedBeca(beca);

    try {
      const reportRequest = {
        semester: selectedType === "Semestrales" ? semesterInput : null,
        beca: beca,
        users: []
      };

      console.log('Datos del informe a enviar:', reportRequest);

      const response = await api.post('/report', reportRequest);
      console.log('Respuesta del servidor:', response.data);

      message.success('Informe generado exitosamente');
      // Aquí podrías actualizar el estado de tu componente con el nuevo informe si es necesario
    } catch (error) {
      console.error('Error al generar informe:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 404) {
        message.error('No se encontró la ruta para generar el informe. Verifica la URL de la API.');
      } else if (error.response && error.response.status === 401) {
        message.error('No estás autorizado. Por favor, inicia sesión nuevamente.');
      } else {
        message.error(`No se pudo generar el informe: ${error.response ? error.response.data.message : error.message}`);
      }
    }
  }, [selectedType, semesterInput]);

  const showDeleteConfirm = (index) => {
    setReportToDelete(index);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    console.log(`Eliminando informe ${reportToDelete}`);
    setIsDeleteModalVisible(false);
    setReportToDelete(null);
    message.success('Informe eliminado exitosamente');
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

  const handleSearch = (value) => {
    setSearchTerm(value);
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
                    backgroundColor: selectedBeca === 'Almuerzo' ? '#C20E1A' : 'white',
                    color: selectedBeca === 'Almuerzo' ? 'white' : '#C20E1A',
                    border: '1px solid #C20E1A'
                  }}
                  onClick={() => generateReport('almuerzo')}
                >
                  Almuerzo
                </Button>
                <Button
                  style={{
                    backgroundColor: selectedBeca === 'Refrigerio' ? '#C20E1A' : 'white',
                    color: selectedBeca === 'Refrigerio' ? 'white' : '#C20E1A',
                    border: '1px solid #C20E1A'
                  }}
                  onClick={() => generateReport('refrigerio')}
                >
                  Refrigerio
                </Button>
              </div>
              <p style={{ textAlign: 'center' }}>
                Aquí puedes buscar los informes diarios generados a través de la fecha
              </p>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '20px' }}>
                <SearchInput onSearch={handleSearch} />
              </div>
            </>
          ) : (
            <>
              <p style={{ textAlign: 'center' }}>
                Para generar los informes semestrales debes ingresar el semestre y seleccionar la beca
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Input
                  placeholder="Semestre informe ej: 2024-2"
                  style={{ width: 200, marginRight: '10px' }}
                  value={semesterInput}
                  onChange={(e) => setSemesterInput(e.target.value)}
                />
                <Button
                  style={{
                    marginRight: '10px',
                    backgroundColor: selectedBeca === 'Almuerzo' ? '#C20E1A' : 'white',
                    color: selectedBeca === 'Almuerzo' ? 'white' : '#C20E1A',
                    border: '1px solid #C20E1A'
                  }}
                  onClick={() => generateReport('Almuerzo')}
                >
                  Almuerzo
                </Button>
                <Button
                  style={{
                    backgroundColor: selectedBeca === 'Refrigerio' ? '#C20E1A' : 'white',
                    color: selectedBeca === 'Refrigerio' ? 'white' : '#C20E1A',
                    border: '1px solid #C20E1A'
                  }}
                  onClick={() => generateReport('Refrigerio')}
                >
                  Refrigerio
                </Button>
              </div>
              <p style={{ textAlign: 'center' }}>
                Aquí puedes buscar los informes semestrales generados a través del semestre
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <SearchInput onSearch={handleSearch} />
              </div>
            </>
          )}

          <TablePagination
            rows={filteredRows}
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
            <p>¿Desea eliminar el informe {selectedType === "Diarios" ? "diario" : "semestral"} {selectedBeca} #{reportToDelete}?</p>
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