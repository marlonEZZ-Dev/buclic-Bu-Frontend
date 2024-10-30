import { useState, useEffect } from 'react';
import HeaderNurse from "../../components/nurse/HeaderNurse";
import { Card, Button, Input, message, Table, Pagination, Modal } from 'antd';
import { EyeOutlined, DownloadOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

export default function InformNurse() {
  const [trimesterInput, setTrimesterInput] = useState('');
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10; // Tamaño de página

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
        setTrimesterInput(''); // Limpia el input después de la generación
        fetchReports(); // Refresca la lista de informes después de generar uno nuevo
      } else {
        message.error('No se pudo generar el informe');
      }
    } catch (error) {
      console.error('Error al generar informe:', error);
      message.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  // Función para obtener la lista de informes de enfermería
  const fetchReports = async (page = 0) => {
    try {
      const response = await api.get(`/nursing-report/list?page=${page}&size=${itemsPerPage}`);
      const { content, totalElements } = response.data;

      setReports(content); // Actualiza la lista de informes
      setTotalItems(totalElements); // Actualiza el número total de informes
    } catch (error) {
      console.error('Error al obtener informes:', error);
      message.error('No se pudieron cargar los informes');
    }
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

  // Cargar la lista de informes al montar el componente
  useEffect(() => {
    fetchReports(currentPage - 1); // Llamada inicial para listar informes
  }, [currentPage]);

  // Cambiar de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchReports(page - 1);
  };

  // Definir las columnas de la tabla, incluyendo la nueva columna de "Año"
  const columns = [
    {
      title: 'Año',
      dataIndex: 'year',
      key: 'year',
      align: 'center',
    },
    {
      title: 'Trimestre',
      dataIndex: 'trimester',
      key: 'trimester',
      align: 'center',
    },
    {
      title: 'Acciones',
      key: 'actions',
      align: 'center',
      render: (text, record) => (
        <span>
          <Button
            icon={<EyeOutlined />}
            style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }}
            onClick={() => navigate(`/enfermeria/VerInforme/${record.id}`)}
          />
          <Button
            icon={<DownloadOutlined />}
            style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }}
            onClick={() => downloadReport(record.id)}
          />
          <Button
            icon={<DeleteOutlined />}
            style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
            onClick={() => showDeleteConfirm(record)}
          />
        </span>
      ),
    },
  ];

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

          <Table
            dataSource={reports}
            columns={columns}
            pagination={false}
            rowKey="id"
            style={{ marginTop: '20px' }}
          />

          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={totalItems}
            onChange={handlePageChange}
            style={{ textAlign: 'center', marginTop: '20px' }}
          />
        </Card>
      </main>
    </>
  );
}
