import React, { useState, useRef } from 'react';
import HeaderNurse from "../../components/nurse/HeaderNurse.jsx";
import esLocale from 'antd/es/date-picker/locale/es_ES';
import SearchInputR from '../../components/global/SearchInputR.jsx';
import moment from 'moment';
import { DatePicker, Form, Card, Space, Input, Select, Row, Col, Button, message } from "antd";
import api from '../../api';

const VisitsNurse = () => {
  const [fecha, setFecha] = useState(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [planDependencia, setPlanDependencia] = useState('');
  const [semestre, setSemestre] = useState('');
  const [genero, setGenero] = useState('');
  const [conducta, setConducta] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [username, setUsername] = useState('');

  // Referencia para el formulario
  const formRef = useRef();

  const diagnosticOptions = [
    "COLICOS_MENSTRUALES",
    "CURACION",
    "DOLOR_DE_CABEZA",
    "DOLOR_ESTOMACAL",
    "DOLOR_MUSCULAR",
    "MALESTAR_GENERAL",
    "MAREOS_DESMAYOS",
    "PRESERVATIVOS",
    "OTRO"
  ];

  const genderOptions = [
    "MASCULINO",
    "FEMENINO",
    "OTRO",
    "NO_RESPONDE"
  ];

  // Maneja el cambio de valor en el Select
  const handleGenderChange = (value) => {
    setGenero(value);
  };


  // Maneja el cambio de valor en el Select
  const handleDiagnosticoChange = (value) => {
    setDiagnostico(value);
  };

  const onChangeFecha = (date, dateString) => {
    if (date) {
      // Solo usa el formato sin convertir a UTC
      setFecha(dateString);  // dateString ya viene en el formato 'YYYY-MM-DD'
    } else {
      setFecha(null);
    }
  };


  const onChangeTelefono = (e) => {
    const value = e.target.value;
    // Asegura que solo se ingresen números y que no sobrepasen los 10 caracteres
    if (/^\d{0,10}$/.test(value)) { // Solo números, hasta 10 caracteres
      setTelefono(value);
    }
  };

  const onChangeConducta = (e) => {
    setConducta(e.target.value);
  };


  // Función para buscar y obtener los datos del usuario
  const handleSearchUser = async () => {
    try {
      const response = await api.get(`/nursing-activities/search/${username}`);
      if (response.status === 200) {
        // Si el usuario es encontrado, llenamos los campos con los datos
        const userData = response.data;
        setUsername(userData.username);
        setNombre(userData.name);
        setApellido(userData.lastname);
        setTelefono(userData.phone);
        setPlanDependencia(userData.plan);
        setSemestre(userData.semester);
        setGenero(userData.gender);
        message.success('Usuario encontrado');
      }
    } catch (error) {
      // Si el usuario no es encontrado, mostramos un mensaje de error
      message.error('Usuario no registrado. Realice el registro para crearlo');
    }
  };


  const handleRegisterActivity = async () => {

    // Validar campos antes de proceder
    const isValid = await formRef.current.validateFields();
    if (!isValid) return; // Si la validación falla, no hace nada

    const payload = {
      date: fecha,
      username: username.trim(), // Asegúrate de que username tenga el valor correcto
      name: nombre,
      lastname: apellido,
      phone: telefono,
      plan: planDependencia,
      semester: semestre,
      gender: genero.toUpperCase(),
      diagnostic: diagnostico,
      conduct: conducta,
    };

    try {
      const response = await api.post('/nursing-activities/register', payload);
      message.success('Actividad registrada exitosamente');

      // Limpiar los campos después de guardar
      resetFields();
    } catch (error) {
      message.error('Ocurrió un error al registrar la actividad');
    }
  };

  // Función para limpiar los campos
  const resetFields = () => {
    setFecha(null);
    setNombre('');
    setApellido('');
    setTelefono('');
    setPlanDependencia('');
    setSemestre('');
    setGenero('');
    setConducta('');
    setDiagnostico('');
    setUsername('');
  };

  // Función para manejar el cancelar
  const handleCancel = () => {
    resetFields();  // Limpiar todos los campos
  };



  return (
    <>
      <HeaderNurse />
      <main className="becas-section" style={{ marginTop: '100px' }}>
        <h1 className="text-xl font-bold" style={{ marginBottom: '12px' }}>Registro de Actividades</h1>
        <p style={{ marginBottom: '6px' }}>Aquí se podrán registrar las actividades de los usuarios en el servicio.</p>

        <Card
          bordered={true}
          style={{
            width: '100%',
            maxWidth: '700px',
            marginTop: '100px',
            margin: '3px auto',
            justifyContent: 'center'
          }}
        >
          <Space direction="vertical" size={16} style={{ width: '95%' }}>
            <Form ref={formRef} layout="vertical">
              <Row gutter={40}>

                <Col span={12}>
                  <Form.Item label="Fecha" labelAlign="left" required>
                    <DatePicker locale={esLocale}
                      onChange={onChangeFecha}
                      value={fecha ? moment(fecha, 'YYYY-MM-DD') : null}
                      style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Código/Cédula" labelAlign="left" required>
                    <SearchInputR
                      value={username} // Asegúrate de que el input tenga el valor del username
                      onSearch={(value) => {
                        setUsername(value); // Actualiza el username con el valor ingresado
                        handleSearchUser(); // Realiza la búsqueda con el código/cédula
                      }}
                      onChange={(e) => setUsername(e.target.value)} // Asegúrate de actualizar el valor cuando se escriba
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Nombre" labelAlign="left" required
                  >
                    <Input
                      placeholder="Nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Apellido" labelAlign="left" required>
                    <Input
                      placeholder="Ingrese el apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}

                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Teléfono" labelAlign="left" required>
                    <Input
                      placeholder="Ingrese el teléfono"
                      value={telefono}
                      onChange={onChangeTelefono}
                      maxLength={10}
                      type="tel"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Plan/Área Dependencia" labelAlign="left" required>
                    <Input
                      placeholder="Ingrese el plan o área de dependencia"
                      value={planDependencia}
                      onChange={(e) => setPlanDependencia(e.target.value)}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Semestre" labelAlign="left">
                    <Input
                      placeholder="Ingrese el semestre"
                      value={semestre}
                      onChange={(e) => setSemestre(e.target.value)}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Género" labelAlign="left" required>
                    <Select
                      value={genero}
                      onChange={handleGenderChange}
                      options={genderOptions.map(option => ({ value: option, label: option }))}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>


                  <Form.Item label="Diagnóstico" labelAlign="left" required>
                    <Select
                      value={diagnostico}
                      onChange={handleDiagnosticoChange}
                      options={diagnosticOptions.map(option => ({ value: option, label: option }))}
                    />
                  </Form.Item>

                </Col>

                <Col span={24}>
                  <Form.Item label="Conducta" labelAlign="left">
                    <Input.TextArea
                      placeholder="Escribe aquí una descripción larga sobre la conducta"
                      value={conducta}
                      onChange={onChangeConducta}
                      rows={4}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Space>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button className="button-save" type="primary" onClick={handleRegisterActivity}>Guardar</Button>
            <Button className="button-cancel" onClick={handleCancel}>Cancelar</Button>
          </div>
        </Card>
      </main>
    </>
  );
};


export default VisitsNurse;