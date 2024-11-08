import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Input, message, Modal } from 'antd';
import { EyeOutlined, DownloadOutlined, DeleteOutlined, SearchOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import HeaderNurse from "../../components/nurse/HeaderNurse";
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import TablePaginationR from '../../components/global/TablePaginationR';

export default function InformNurse() {
  const [trimesterInput, setTrimesterInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Función para extraer el año y el trimestre del input y construir el JSON
  const parseTrimesterInput = (input) => {
    const regex = /^(\d{4})-(\d)$/;
    const match = input.match(regex);
    return match ? { year: parseInt(match[1], 10), trimester: parseInt(match[2], 10) } : null;
  };

  const generateReport = async () => {
    const parsedData = parseTrimesterInput(trimesterInput);
    if (!parsedData) {
      message.error('Por favor, ingrese un trimestre en el formato correcto (ej: 2024-2).');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/nursing-report', parsedData);
      if (response.status === 201 || response.status === 200) {
        message.success('Informe generado exitosamente');
        setTrimesterInput('');
        fetchReports(1);
      }
    } catch (error) {
      console.error('Error al generar informe:', error);
      message.error(`Error: ${error.response?.data?.message || 'Error al generar el informe'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const searchReportById = async () => {
    const reportId = parseInt(searchInput, 10);
    if (isNaN(reportId)) {
      message.warning('Por favor, ingrese un ID de informe válido.');
      return;
    }

    try {
      const response = await api.get(`/nursing-report/${reportId}`);
      setReports(response.data ? [response.data] : []);
      setTotalItems(response.data ? 1 : 0);
      setNoResults(!response.data);

      if (response.data) {
        message.success('Informe cargado exitosamente.');
      } else {
        message.info('No se encontró un informe con el ID especificado.');
      }
    } catch (error) {
      console.error('Error al buscar el informe:', error);
      message.error(`Error al realizar la búsqueda: ${error.response?.data?.message || error.message}`);
      setNoResults(true);
    }
  };

  const fetchReports = useCallback(async (page = 1) => {
    try {
      const response = await api.get('/nursing-report/list', {
        params: {
          page: page - 1,
          size: itemsPerPage
        }
      });

      if (response.data && response.data.page) {
        setReports(response.data.content);
        setTotalItems(response.data.page.totalElements);
        setNoResults(response.data.content.length === 0);
        setIsSearchMode(false); // Reinicia el modo de búsqueda al cargar informes totales
      } else {
        console.error('Unexpected API response structure:', response.data);
        message.error('Error en la estructura de datos recibida');
      }
    } catch (error) {
      console.error('Error al obtener informes:', error);
      message.error('No se pudieron cargar los informes');
      setNoResults(true);
    }
  }, []);

  useEffect(() => {
    fetchReports(currentPage);
  }, [fetchReports, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchReports(page);
  };

  const handleSearch = () => {
    if (!searchInput) {
      message.warning('Por favor, ingrese un trimestre para buscar.');
      return;
    }
    setCurrentPage(1);
    searchReportById();
  };

  const handleReloadTable = () => {
    setTrimesterInput('');
    setSearchInput('');
    setCurrentPage(1);
    setNoResults(false);
    fetchReports(1);
  };

  // Función para descargar un informe
  const downloadReport = async (id) => {
    try {
      const response = await api.get(`/nursing-report/download/${id}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_nursing_${id}.xlsx`);
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

  // Función para eliminar un informe
  const deleteReport = async (id) => {
    try {
      const response = await api.delete(`/nursing-report/delete/${id}`);

      if (response.status === 200) {
        message.success('Informe de enfermería eliminado correctamente');
        fetchReports(currentPage);
      } else {
        message.error('No se pudo eliminar el informe');
      }
    } catch (error) {
      console.error('Error al eliminar informe:', error);
      message.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: 'Confirmar',
      icon: <ExclamationCircleOutlined />,
      content: `¿Desea eliminar el informe trimestral ${record.year}-${record.trimester}?`,
      okText: 'Aceptar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        deleteReport(record.id);
      },
      okButtonProps: {
        style: { backgroundColor: '#C20E1A', color: 'white', border: 'none' },
      },
      cancelButtonProps: {
        style: { borderColor: '#C20E1A', color: '#C20E1A' },
      },
    });
  };

  const rows = reports.map(report => [
    `${report.year}-${report.trimester}`,
    <span>
      <Button
        icon={<EyeOutlined />}
        style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }}
        onClick={() => navigate(`/enfermeria/VerInforme/${report.id}`)}
      />
      <Button
        icon={<DownloadOutlined />}
        style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }}
        onClick={() => downloadReport(report.id)}
      />
      <Button
        icon={<DeleteOutlined />}
        style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
        onClick={() => showDeleteConfirm(report)}
      />
    </span>
  ]);

  return (
    <>
    <HeaderNurse />
    <main className="informes-section" style={{ marginTop: '100px', padding: '0 20px' }}>
      <h1 style={{ color: '#C20E1A', textAlign: 'center', marginBottom: 20 }}>Informes</h1>
      <p style={{ textAlign: 'center' }}>Para generar los informes debes ingresar el trimestre.</p>

      <Card bordered={true} style={{ width: '100%', maxWidth: '700px', margin: '20px auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Input
            placeholder="Trimestre informe ej: 2024-2"
            style={{ width: '70%', marginRight: '10px' }}
            value={trimesterInput}
            onChange={(e) => setTrimesterInput(e.target.value)}
          />
          <Button
            style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
            onClick={generateReport}
          >
            Generar
          </Button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>
          Aquí puedes buscar los informes generados por ID de informe.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Input
            placeholder="ID informe"
            style={{ width: '70%', marginRight: '10px' }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            prefix={<SearchOutlined />}
          />
          <Button
            style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
            onClick={handleSearch}
          >
            <SearchOutlined />
          </Button>
        </div>

        {noResults ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'red' }}>No se encontró ningún informe con el ID especificado.</p>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReloadTable}
              style={{ backgroundColor: '#C20E1A', color: 'white' }}
            >
              Recargar Tabla
            </Button>
          </div>
        ) : (
          <TablePaginationR
            columns={['Trimestre', 'Acciones']}
            rows={rows}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        )}
      </Card>
    </main>
  </>
  );
}