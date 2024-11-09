import React, { useState, useEffect } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import ReusableModal from '../../components/global/ReusableModal';
import { Button, Col, Form, Card, Space, Row, Input, Select, message } from 'antd';
import api from '../../api';
import SearchInputR from '../../components/global/SearchInputR';

const ExternosAdmin = () => {

  const [becas, setBecas] = useState('');
  const [cedula, setCedula] = useState('');
  const [externoData, setExternoData] = useState(null);
  const [form] = Form.useForm();

  const becasOptions = [
    { value: 'Almuerzo', label: 'Almuerzo' },
    { value: 'Refrigerio', label: 'Refrigerio' }
  ];

  const handleCedulaChange = (e) => {
    setCedula(e.target.value);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const requestPayload = {
        username: values.cedula,
        name: values.name,
        lastname: values.lastname,
        plan: values.dependencia,
        email: values.email,
        lunch: becas === 'Almuerzo',
        snack: becas === 'Refrigerio'
      };

      const response = await api.post('/reservations/create-extern', requestPayload);

      if (response.status === 200) {
        message.success('Reserva realizada con éxito.');
        form.resetFields();
        setBecas('');
      } else {
        message.error('Error al realizar la reserva.');
      }
    } catch (error) {
      message.error('Por favor complete todos los campos correctamente.');
      console.error('Error al realizar la reserva:', error);
    }
  };

  const handleBecasChange = (value) => {
    setBecas(value);
  };


  const handleSearch = async () => {
    try {
      const response = await api.get(`/reservations/extern/${cedula}`);
      const externoData = response.data;

      // Rellenar los campos del formulario con los datos obtenidos
      form.setFieldsValue({
        username: externoData.cedula,
        name: externoData.name,
        lastname: externoData.lastname,
        dependencia: externoData.plan,
        email: externoData.email,
      });

      message.success('Usuario encontrado');
    } catch (error) {
      console.error("Error al buscar el usuario externo:", error);
      message.error('Usuario no encontrado');
    }
  };



  return (
    <>
      <HeaderAdmin />
      <main className="becas-section" style={{ marginTop: '100px' }}>
        <h1 className="text-xl font-bold" style={{ marginBottom: '12px' }}>Reserva para Externos</h1>
        <p style={{ marginBottom: '6px' }}>Aquí se podrán registrar los becas para los usuarios externos.</p>

        <Card
          bordered={true}
          style={{
            width: '100%',
            maxWidth: '700px',
            marginTop: '100px',
            margin: '3px auto',
            justifyContent:
              'center'
          }}>

          <Space direction="vertical" size={16} style={{ width: '95%' }}>
            <Form form={form} layout="vertical"> {/* Aquí se conecta la instancia de formulario */}
              <Row gutter={40}>
                <Col span={12}>
                  <Form.Item label="Cédula" labelAlign="left" name="cedula" rules={[
                    { required: true, message: 'Por favor ingrese su número de cédula' },
                    { pattern: /^[1-9]\d*$/, message: 'Solo se permiten números positivos' },
                  ]}>
                    <SearchInputR
                      onSearch={handleSearch}
                      value={cedula}
                      onChange={handleCedulaChange}
                      placeholder="Ingrese la cédula"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Nombre" labelAlign="left" name="name" required>
                    <Input placeholder="Ingrese el nombre" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Apellido" labelAlign="left" name="lastname" required>
                    <Input placeholder="Ingrese el apellido" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Área Dependencia" labelAlign="left" name="dependencia" required>
                    <Input placeholder="Ingrese el área de dependencia" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Correo"
                    labelAlign="left"
                    name="email"
                    required
                    rules={[
                      { required: true, message: 'Por favor ingrese su correo electrónico' },
                      { type: 'email', message: 'Por favor ingrese un correo electrónico válido' }
                    ]}
                  >
                    <Input type="email" placeholder="Ingrese el correo" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Tipo de beca" labelAlign="left" required>
                    <Select
                      value={becas}
                      options={becasOptions}
                      onChange={handleBecasChange}
                      placeholder="Seleccione tipo de beca"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Space>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button className="button-save" onClick={handleSave}>Guardar</Button>
            <Button className="button-cancel" onClick={() => form.resetFields()}>Cancelar</Button>
          </div>
        </Card>
      </main>
    </>
  );
};

export default ExternosAdmin;