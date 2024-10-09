import React from 'react';
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import { Button, Table } from 'antd';
import { ArrowLeftOutlined} from '@ant-design/icons';

const ViewInforms = ({ onClose }) => {
  const beneficiariesColumns = [
    { title: '#', dataIndex: 'index', key: 'index' },
    { title: 'Código', dataIndex: 'code', key: 'code' },
    { title: 'Nombre', dataIndex: 'name', key: 'name' },
    { title: 'Plan', dataIndex: 'plan', key: 'plan' },
    { title: 'Correo', dataIndex: 'email', key: 'email' },
  ];

  const freeSaleColumns = [
    { title: '#', dataIndex: 'index', key: 'index' },
    { title: 'Código/Cédula', dataIndex: 'code', key: 'code' },
    { title: 'Nombre', dataIndex: 'name', key: 'name' },
    { title: 'Plan/Área', dataIndex: 'plan', key: 'plan' },
    { title: 'Correo', dataIndex: 'email', key: 'email' },
  ];

  const beneficiariesData = [
    { key: '1', index: 1, code: '202358920', name: 'Mariana Gomez', plan: '4256', email: 'mariana.gomez@correounivalle.edu.co' },
    { key: '2', index: 2, code: '202175899', name: 'Amber Rojas', plan: '8232', email: 'amber.rojas@correounivalle.edu.co' },
  ];

  const freeSaleData = [
    { key: '1', index: 1, code: '88563124', name: 'Carlos Vallejo', plan: 'Psicología', email: 'carlos.vallejo@correounivalle.edu.co' },
    { key: '2', index: 2, code: '202175899', name: 'Lucia Bernal', plan: '1005', email: 'lucia.bernal@correounivalle.edu.co' },
  ];

  return (
    <div style={{ 
      paddingTop: '90px', // To account for the fixed header height
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <HeaderAdmin />
      <div style={{ 
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 0 10px rgba(0,0,0,0.1)', 
          padding: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={onClose} style={{ backgroundColor:'#C20E1A', color:'#fff', border: 'none', boxShadow: 'none' }} />
            <h2 style={{ margin: 0, color: '#C20E1A' }}>Informe diario</h2>
            <Button type="primary"  style={{ backgroundColor: '#C20E1A', borderColor: '#C20E1A' }}>
              Descargar
            </Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <p><strong>Fecha:</strong> 08/09/2024</p>
            <p><strong>Beca:</strong> Almuerzo</p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#C20E1A' }}>Beneficiarios</h3>
            <Table
              dataSource={beneficiariesData}
              columns={beneficiariesColumns}
              pagination={false}
              size="small"
            />
          </div>
          <div>
            <h3 style={{ color: '#C20E1A' }}>Venta libre</h3>
            <Table
              dataSource={freeSaleData}
              columns={freeSaleColumns}
              pagination={false}
              size="small"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInforms;