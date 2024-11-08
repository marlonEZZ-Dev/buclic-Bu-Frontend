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
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Función para extraer el año y el trimestre del input y construir el JSON
  const parseTrimesterInput = (input) => {
    const regex = /^(\d{4})-(\d)$/; // Regex para validar el formato YYYY-T
    const match = input.match(regex);

    if (match) {
      const year = parseInt(match[1], 10); // Año
      const trimester = parseInt(match[2], 10); // Trimestre
      return { year, trimester };
    }

    return null; // Retorna null si el formato no es válido
  };

  // Función para generar el informe
  const generateReport = async () => {
    const parsedData = parseTrimesterInput(trimesterInput);

    if (!parsedData) {
      message.warning('Por favor, ingrese un trimestre en el formato correcto (ej: 2024-2).');
      return;
    }

    try {
      const response = await api.post('/nursing-report', parsedData);

      if (response.status === 201 || response.status === 200) {
        message.success('Informe generado exitosamente');
        setTrimesterInput('');
        fetchReports(); // Actualiza la lista de informes
      } else {
        message.error('No se pudo generar el informe');
      }
    } catch (error) {
      console.error('Error al generar informe:', error);
      message.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };


  const searchReports = async () => {
    const regex = /^(\d{4})-(\d)$/; // Regex para validar y capturar el año y trimestre
    const match = searchInput.match(regex);

    if (!match) {
      message.warning('Por favor, ingrese el trimestre en el formato correcto (ej: 2024-2).');
      return;
    }

    const year = parseInt(match[1], 10);
    const trimester = parseInt(match[2], 10);

    try {
      const response = await api.get('/nursing-report/search', {
        params: { year, trimester },
      });

      setReports(response.data); // Actualiza los informes con los resultados de la búsqueda
      setTotalItems(response.data.length); // Actualiza el número total de elementos para la paginación si es necesario
      setCurrentPage(1); // Reinicia la paginación a la primera página en caso de búsqueda
      message.success('Resultados de búsqueda cargados.');
    } catch (error) {
      console.error('Error al buscar informes:', error);
      message.error('No se pudo realizar la búsqueda.');
    }
  };


  // Función para obtener la lista de informes de enfermería
  const fetchReports = useCallback(async (page = 1, search = '') => {
    try {
      const response = await api.get(`/nursing-report/list?page=${page - 1}&size=${itemsPerPage}&search=${search}`);
      const { content, totalElements, number } = response.data;

      setReports(content);
      setTotalItems(totalElements);
      setCurrentPage(number + 1);
      setNoResults(content.length === 0);
    } catch (error) {
      console.error('Error al obtener informes:', error);
      message.error('No se pudieron cargar los informes');
      setNoResults(true);
    }
  }, []);

  useEffect(() => {
    fetchReports(currentPage, searchInput);
  }, [fetchReports, currentPage, searchInput]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    if (!searchInput) {
      message.warning('Por favor, ingrese un trimestre para buscar.');
      return;
    }
    setCurrentPage(1);
    fetchReports(1, searchInput);
  };

  const handleReloadTable = () => {
    setTrimesterInput('');
    setSearchInput('');
    setCurrentPage(1);
    setNoResults(false);
    fetchReports(1); // Recargar todos los informes sin filtro
  };

  // Función para descargar un informe
  const downloadReport = async (id) => {
    try {
      const response = await api.get(`/nursing-report/download/${id}`, {
        responseType: 'blob',
      });

      // Crear un objeto Blob para el archivo descargado
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Crear un enlace de descarga para el archivo
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
        fetchReports(); // Refresca la lista de informes después de la eliminación
      } else {
        message.error('No se pudo eliminar el informe');
      }
    } catch (error) {
      console.error('Error al eliminar informe:', error);
      message.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  // Mostrar el modal de confirmación antes de eliminar
  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: 'Confirmar',
      icon: <ExclamationCircleOutlined />,
      content: `¿Desea eliminar el informe trimestral ${record.year}-${record.trimester}?`,
      okText: 'Aceptar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        deleteReport(record.id); // Llamada para eliminar el informe si se confirma
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
              onClick={() => generateReport()}
            >
              Generar
            </Button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />
          <p style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>
            Aquí puedes buscar los informes generados a través del trimestre
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Input
              placeholder="Trimestre informe"
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
              <p style={{ color: 'red' }}>No se encontraron resultados para la búsqueda.</p>
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
