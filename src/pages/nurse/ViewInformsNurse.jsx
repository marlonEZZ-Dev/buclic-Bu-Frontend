import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, message, Spin, Card, Table } from 'antd';
import { LeftOutlined, DownloadOutlined } from '@ant-design/icons';
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import api from '../../api';

const ViewNursingReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // Cargar informe al montar el componente
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/nursing-report/${id}`);
        setReport(response.data);
      } catch (error) {
        console.error('Error al cargar informe:', error);
        message.error('No se pudo cargar el informe.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  // Función para descargar el informe
  const handleDownload = async () => {
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

      message.success('Informe descargado exitosamente.');
    } catch (error) {
      console.error('Error al descargar informe:', error);
      message.error(`No se pudo descargar el informe: ${error.response?.data?.message || error.message}`);
    }
  };

  // Definición de las columnas de la tabla
  const columns = [
    {
      title: 'Motivos',
      dataIndex: 'reason',
      key: 'reason',
      align: 'center',
    },
    {
      title: 'Cantidad',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
    },
  ];

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />;
  }

  if (!report) {
    return <div>No se pudo cargar el informe. Por favor, intente de nuevo más tarde.</div>;
  }

  return (
    <div>
      {/* Encabezado del Administrador */}
      <HeaderAdmin />

      {/* Contenido Principal */}
      <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto', marginTop: '60px' }}>
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                icon={<LeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ border: 'none', backgroundColor: '#C20E1A', color: 'white' }}
              >
                Volver
              </Button>
              <span style={{ fontSize: '20px', color: '#C20E1A' }}>Informe trimestral</span>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
              >
                Descargar
              </Button>
            </div>
          }
          style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <p style={{ fontSize: '16px' }}><strong>Semestre:</strong> {report.semester}</p>
          </div>

          <Table
            dataSource={report.details || []}
            columns={columns}
            pagination={false}
            rowKey="reason"
            bordered
            style={{ marginTop: '20px' }}
          />
        </Card>
      </div>
    </div>
  );
};

export default ViewNursingReport;
