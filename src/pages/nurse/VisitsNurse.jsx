import React, { useState } from 'react';
import HeaderNurse from "../../components/nurse/HeaderNurse.jsx";
import esLocale from 'antd/es/date-picker/locale/es_ES';
import SearchInputR from '../../components/global/SearchInputR.jsx';
import moment from 'moment';
import { DatePicker, Form, Card, Space, Input, Select, Row, Col, Button, message } from "antd";
import api from '../../api';

const VisitsNurse = () => {
  const [fecha, setFecha] = useState(null);
  const [username, setUsername] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [planDependencia, setPlanDependencia] = useState('');
  const [semestre, setSemestre] = useState('');
  const [genero, setGenero] = useState('');
  const [conducta, setConducta] = useState('');
  const [diagnostico, setDiagnostico] = useState('');

  const [form] = Form.useForm();


  const diagnosticOptions = ["COLICOS_MENSTRUALES", "CURACION", "DOLOR_DE_CABEZA", "DOLOR_ESTOMACAL", "DOLOR_MUSCULAR", "MALESTAR_GENERAL", "MAREOS_DESMAYOS", "PRESERVATIVOS", "OTRO"];
  const genderOptions = ["MASCULINO", "FEMENINO", "OTRO", "NO_RESPONDE"];

  const handleSearchUser = async () => {
    try {
      const { data } = await api.get(`/nursing-activities/search/${username}`);
      setUsername(data.username);
      setNombre(data.name);
      setApellido(data.lastname);
      setTelefono(data.phone);
      setPlanDependencia(data.plan);
      setSemestre(data.semester);
      setGenero(data.gender);

      // Actualizar los valores del formulario con los datos encontrados
      form.setFieldsValue({
        username: data.username,
        nombre: data.name,
        apellido: data.lastname,
        telefono: data.phone,
        planDependencia: data.plan,
        semestre: data.semester,
        genero: data.gender,
      });
      message.success('Usuario encontrado');
    } catch {
      message.error('Usuario no registrado. Realice el registro para crearlo');
    }
  };

  const handleRegisterActivity = async () => {
    // Validar campos requeridos
    form.validateFields()
      .then(async () => {
        const payload = {
          date: fecha,
          username: username.trim(),
          name: nombre,
          lastname: apellido,
          phone: telefono,
          plan: planDependencia,
          semester: semestre,
          gender: genero.toUpperCase(),
          diagnostic: diagnostico,
          conduct: conducta
        };
        try {
          await api.post('/nursing-activities/register', payload);
          message.success('Actividad registrada exitosamente');
          resetFields();
        } catch {
          message.error('Ocurrió un error al registrar la actividad');
        }
      })
      .catch(() => {
        message.error('Por favor, complete todos los campos obligatorios');
      });
  };


  const resetFields = () => {
    setFecha(null);
    setUsername('');
    setNombre('');
    setApellido('');
    setTelefono('');
    setPlanDependencia('');
    setSemestre('');
    setGenero('');
    setConducta('');
    setDiagnostico('');
    form.resetFields();  // Resetear el formulario de Ant Design
  };

  return (
    <>
      <HeaderNurse />
      <main className="becas-section" style={{ marginTop: '100px' }}>
        <h1 className="text-xl font-bold" style={{ marginBottom: '12px' }}>Registro de Actividades</h1>
        <p style={{ marginBottom: '6px' }}>Aquí se podrán registrar las actividades de los usuarios en el servicio.</p>
        <Card bordered style={{ width: '100%', maxWidth: '700px', margin: '3px auto' }}>
          <Space direction="vertical" size={16} style={{ width: '95%' }}>
            <Form form={form} layout="vertical">
              <Row gutter={40}>
                <Col span={12}>
                  <Form.Item label="Fecha" name="fecha"
                    required
                    rules={[{ required: true, message: 'La fecha es obligatoria' }]}
                  >
                    <DatePicker locale={esLocale}
                      onChange={(date) => setFecha(date)}
                      value={fecha} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Código/Cédula" name="username"
                    required
                    rules={[{ required: true, message: 'El código/cedula es obligatorio' }]}
                  >
                    <SearchInputR value={username} onSearch={() => handleSearchUser()} onChange={(e) => setUsername(e.target.value)} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Nombre" name="nombre"
                    required
                    rules={[{ required: true, message: 'El nombre es obligatorio' }]}
                  >

                    <Input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Apellido" name="apellido"
                    required
                    rules={[{ required: true, message: 'El apellido es obligatorio' }]}
                  >
                    <Input placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Teléfono" name="telefono"
                    required
                    rules={[{ required: true, message: 'El teléfono es obligatorio' }]}
                  >
                    <Input placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} maxLength={10} type="tel" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Plan/Área Dependencia" name="planDependencia"
                    rules={[{ required: true, message: 'El plan de dependencia es obligatorio' }]}
                  >
                    <Input placeholder="Plan o área de dependencia" value={planDependencia} onChange={(e) => setPlanDependencia(e.target.value)} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Semestre">
                    <Input placeholder="Semestre" value={semestre} onChange={(e) => setSemestre(e.target.value)} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Género" name="genero"
                    required
                    rules={[{ required: true, message: 'El género es obligatorio' }]}
                  >
                    <Select value={genero} onChange={setGenero} options={genderOptions.map(option => ({ value: option, label: option }))} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Diagnóstico" name="diagnostico"
                    required
                    rules={[{ required: true, message: 'El diagnóstico es obligatorio' }]}
                  >
                    <Select value={diagnostico} onChange={setDiagnostico} options={diagnosticOptions.map(option => ({ value: option, label: option }))} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Conducta">
                    <Input.TextArea placeholder="Descripción de la conducta" value={conducta} onChange={(e) => setConducta(e.target.value)} rows={4} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Space>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button type="primary" className='button-save' onClick={handleRegisterActivity}>Guardar</Button>
            <Button className='button-cancel' onClick={resetFields}>Cancelar</Button>
          </div>
        </Card>
      </main >
    </>
  );
};

export default VisitsNurse;
