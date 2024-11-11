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
        lastName: values.lastname,
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
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 && data.message) {
          // Mostrar mensaje de error específico del backend
          message.error(data.message);
        } else if (status === 500) {
          // Error de servidor
          message.error('Error del servidor. Inténtalo de nuevo más tarde.');
        } else {
          message.error('Ocurrió un error desconocido.');
        }
      } else {
        // Error de red
        message.error('No se pudo conectar con el servidor. Verifica tu conexión.');
      }
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
        lastname: externoData.lastName,
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
        <h1 className="text-xl font-bold" style={{ marginBottom: '12px' }}>Reserva para externos</h1>
        <p style={{ marginBottom: '6px' }}>Aquí se podrán registrar las reservas para usuarios externos.</p>

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
                    { required: true, message: 'Por favor ingrese el número de cédula' },
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
                  <Form.Item label="Nombre" labelAlign="left" name="name" rules={[
                    { required: true, message: 'Por favor ingrese el nombre' },]}>
                    <Input placeholder="Ingrese el nombre" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Apellido" labelAlign="left" name="lastname" rules={[
                    { required: true, message: 'Por favor ingrese el apellido' },
                  ]}>
                    <Input placeholder="Ingrese el apellido" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Área Dependencia" labelAlign="left" name="dependencia" rules={[
                    { required: true, message: 'Por favor ingrese el área de dependencia' },
                  ]}>
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
                      { required: true, message: 'Por favor ingrese el correo electrónico' },
                      { type: 'email', message: 'Por favor ingrese un correo electrónico válido' }
                    ]}
                  >
                    <Input type="email" placeholder="Ingrese el correo" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label={<span>Tipo de beca</span>}
                    name="becas" labelAlign="left"
                    rules={[
                      { required: true, message: 'Por favor ingrese el tipo de beca' },
                    ]}
                  >
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