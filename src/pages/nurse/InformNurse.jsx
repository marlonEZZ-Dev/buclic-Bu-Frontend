import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNurse from "../../components/nurse/HeaderNurse";
import { Card, Button, Input } from 'antd';
import { EyeOutlined, DownloadOutlined, DeleteOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons';

export default function InformNurse() {
  const [trimesterInput, setTrimesterInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Simulación de datos de informes para mostrar en la tabla
  const reports = [
    { id: 1, trimester: '2023-1' },
    { id: 2, trimester: '2023-2' }
  ];

  // Función para renderizar las acciones de cada fila
  const renderActions = (reportId) => (
    <span>
      <Button
        icon={<EyeOutlined />}
        style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }}
        onClick={() => navigate(`/nurse/report/${reportId}`)}
      />
      <Button
        icon={<DownloadOutlined />}
        style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }}
      />
      <Button
        icon={<DeleteOutlined />}
        style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
      />
    </span>
  );

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
            >
              Generar
            </Button>
          </div>
          
          <p style={{ textAlign: 'center' }}>Aquí puedes buscar los informes generados a través del trimestre</p>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Input
              placeholder="Trimestre informe"
              style={{ width: '70%', marginRight: '10px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              icon={<SearchOutlined />}
              style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
            />
            <Button
              icon={<RedoOutlined />}
              style={{ backgroundColor: '#C20E1A', color: 'white', marginLeft: '10px', border: 'none' }}
              onClick={() => setSearchTerm('')}
            />
          </div>

          <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Trimestre</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    {report.trimester}
                  </td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    {renderActions(report.id)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </>
  );
}
