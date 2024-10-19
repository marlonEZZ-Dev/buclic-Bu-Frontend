import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, message, DatePicker } from 'antd';
import { EyeOutlined, DownloadOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import MenuBecas from "../../components/global/MenuBecas.jsx";
import TablePaginationR from '../../components/global/TablePaginationR.jsx';
import Modal from '../../components/global/Modal.jsx';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const CombinedReports = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("Diarios");
  const [selectedBeca, setSelectedBeca] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [semesterInput, setSemesterInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateSearch, setDateSearch] = useState(null);

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
      const response = await api.get(`/report/list?filter=${filter}&page=${currentPage - 1}&size=${itemsPerPage}&search=${searchTerm}`);
      setReports(response.data.content);
      setTotalItems(response.data.totalElements);
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
    setCurrentPage(1);
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
      fetchReports();
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

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/report/delete/${reportToDelete}`);
      message.success('Informe eliminado correctamente');
      setIsDeleteModalVisible(false);
      setReportToDelete(null);
      fetchReports();
    } catch (error) {
      console.error('Error al eliminar informe:', error);
      message.error(`No se pudo eliminar el informe: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDownload = async (reportId) => {
    try {
      const response = await api.get(`/report/download/${reportId}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${reportId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success('Informe descargado exitosamente');
    } catch (error) {
      console.error('Error al descargar informe:', error);
      message.error(`No se pudo descargar el informe: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleViewReport = (reportId) => {
    navigate(`/admin/VerInforme/${reportId}`);
  };

  const renderActions = (reportId) => (
    <span>
      <Button
        icon={<EyeOutlined />}
        style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }}
        onClick={() => handleViewReport(reportId)}
      />
      <Button
        icon={<DownloadOutlined />}
        style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }}
        onClick={() => handleDownload(reportId)}
      />
      <Button
        icon={<DeleteOutlined />}
        style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
        onClick={() => showDeleteConfirm(reportId)}
      />
    </span>
  );

  const handleCustomSearch = async () => {
    try {
      let endpoint;
      let searchValue;

      if (selectedType === "Diarios") {
        if (!dateSearch) {
          message.warning('Por favor, seleccione una fecha para buscar.');
          return;
        }
        searchValue = dateSearch.format('YYYY-MM-DD');
        endpoint = `/report/date/${searchValue}`;
      } else {
        if (!semesterInput) {
          message.warning('Por favor, ingrese un semestre para buscar.');
          return;
        }
        searchValue = semesterInput;
        endpoint = `/report/semester/${searchValue}`;
      }

      const response = await api.get(endpoint);
      setReports(response.data);
      message.success('Búsqueda realizada con éxito');
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      message.error(`No se pudo realizar la búsqueda: ${error.response?.data?.message || error.message}`);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <DatePicker
                  style={{ marginRight: '10px' }}
                  onChange={(date) => setDateSearch(date)}
                />
                <Button
                  icon={<SearchOutlined />}
                  style={{
                    backgroundColor: '#C20E1A',
                    color: 'white',
                    border: 'none'
                  }}
                  onClick={handleCustomSearch}
                >
                  Buscar por Fecha
                </Button>
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
                <Input
                  placeholder="Semestre informe ej: 2024-2"
                  style={{ width: 200, marginRight: '10px' }}
                  value={semesterInput}
                  onChange={(e) => setSemesterInput(e.target.value)}
                />
                <Button
                  icon={<SearchOutlined />}
                  style={{
                    backgroundColor: '#C20E1A',
                    color: 'white',
                    border: 'none'
                  }}
                  onClick={handleCustomSearch}
                >
                  Buscar por Semestre
                </Button>
              </div>
            </>
          )}

          <TablePaginationR
            rows={reports.map(formatReportData)}
            columns={selectedType === "Diarios" ? columnsDaily : columnsSemestral}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
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
              <Button type="primary" danger onClick={handleDeleteConfirm}>
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