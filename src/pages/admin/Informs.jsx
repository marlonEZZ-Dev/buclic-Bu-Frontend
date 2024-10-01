import React, { useState } from 'react';
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import MenuBecas from "../../components/global/MenuBecas.jsx";
import { Input, Button, Table, Pagination } from 'antd';
import { EyeOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';

const { Search } = Input;

const Informs = () => {
  const [selectedType, setSelectedType] = useState("Diarios");

  const buttons = [
    { type: "Diarios", label: "Diarios" },
    { type: "Semestrales", label: "Semestrales" },
  ];

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Fecha generado',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Beca',
      dataIndex: 'scholarship',
      key: 'scholarship',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: () => (
        <span>
          <Button icon={<EyeOutlined />} style={{ color: '#C20E1A', marginRight: 8, border: 'none' }} />
          <Button icon={<DownloadOutlined />} style={{ color: '#C20E1A', marginRight: 8, border: 'none' }} />
          <Button icon={<DeleteOutlined />} style={{ color: '#C20E1A', border: 'none' }} />
        </span>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'Almuerzo #1',
      date: '08/09/2024',
      scholarship: 'Almuerzo',
    },
    {
      key: '2',
      name: 'Refrigerio #1',
      date: '08/09/2024',
      scholarship: 'Refrigerio',
    },
  ];

  return (
    <>
      <HeaderAdmin />
      <div className="becas-section">
        <MenuBecas
          onSelect={setSelectedType}
          buttons={buttons}
          selectedType={selectedType}
        >
          <h2 style={{ color: '#C20E1A', marginBottom: 16, textAlign: 'center' }}>Informes diarios</h2>

          <Search
            placeholder="Fecha informe diario"
            onSearch={value => console.log(value)}
            style={{ width: '100%', maxWidth: 300, marginBottom: 16 }}
          />

          <Table 
            columns={columns} 
            dataSource={data} 
            pagination={false}
            style={{ marginBottom: 16 }}
          />

          <Pagination 
            total={50} 
            showSizeChanger={false} 
            showQuickJumper={false}
            size="small"
            style={{ textAlign: 'center' }}
            itemRender={(page, type) => {
              if (type === 'prev') return <Button size="small">Anterior</Button>;
              if (type === 'next') return <Button size="small">Siguiente</Button>;
              return <Button size="small" style={{ backgroundColor: page === 1 ? '#C20E1A' : 'white', color: page === 1 ? 'white' : 'black' }}>{page}</Button>;
            }}
          />
        </MenuBecas>
      </div>
    </>
  );
};

export default Informs;