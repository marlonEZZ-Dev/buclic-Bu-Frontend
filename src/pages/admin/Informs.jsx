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
  const [currentPage, setCurrentPage] = useState(0);
  const [reports, setReports] = useState([]);
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

  const fetchReports = useCallback(async () => {
    try {
      const filter = selectedType === "Diarios" ? "diario" : "semester";
      const response = await api.get(`/report/list?filter=${filter}&page=${currentPage}&size=${itemsPerPage}&search=${searchTerm}`);
      setReports(response.data.content);
    } catch (error) {
      console.error('Error fetching reports:', error);
      message.error('No se pudieron cargar los informes');
    }
  }, [selectedType, currentPage, searchTerm]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    setSelectedBeca(null);
    setSemesterInput('');
    setSearchTerm('');
    setCurrentPage(0);
  }, [selectedType]);

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

      const response = await api.post('/report', reportRequest);
      message.success('Informe generado exitosamente');
      fetchReports(); // Recargar los informes después de generar uno nuevo
    } catch (error) {
      console.error('Error al generar informe:', error);
      message.error(`No se pudo generar el informe: ${error.response?.data?.message || error.message}`);
    }
  }, [selectedType, semesterInput, fetchReports]);

  const showDeleteConfirm = (reportId) => {
    setReportToDelete(reportId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setReportToDelete(null);
  };

  const renderActions = (reportId) => (
    <span>
      <Button icon={<EyeOutlined />} style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }} />
      <Button icon={<DownloadOutlined />} style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }} />
      <Button icon={<DeleteOutlined />} style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }} onClick={() => showDeleteConfirm(reportId)} />
    </span>
  );

  const handlePageChange = (page) => {
    console.log('Página actual:', page);
    setCurrentPage(page - 1); // Restamos 1 porque la API usa base 0 para las páginas
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(0); // Reiniciar a la primera página al buscar
    fetchReports(); // Llamar a fetchReports después de actualizar searchTerm y currentPage
  };

  const formatReportData = (report) => {
    if (selectedType === "Diarios") {
      return [report.date, report.beca, renderActions(report.id)];
    } else {
      return [report.beca, report.semester, renderActions(report.id)];
    }
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
            </>
          )}

          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '20px' }}>
            <SearchInput onSearch={handleSearch} />
          </div>

          <TablePagination
            rows={reports.map(formatReportData)}
            columns={selectedType === "Diarios" ? columnsDaily : columnsSemestral}
            currentPage={currentPage + 1} // Sumamos 1 porque TablePagination usa base 1
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />

          <Modal
            open={isDeleteModalVisible}
            onClose={handleDeleteCancel}
            modalTitle="Confirmar eliminación"
          >
            <p>¿Desea eliminar el informe {selectedType === "Diarios" ? "diario" : "semestral"} seleccionado?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button onClick={handleDeleteCancel} style={{ marginRight: '10px' }}>
                Cancelar
              </Button>
              <Button type="primary" danger>
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