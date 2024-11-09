import React, { useState } from 'react';
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
      // Formatea la fecha sin hora, solo "YYYY-MM-DD"
      setFecha(moment(date).format('YYYY-MM-DD'));
    } else {
      setFecha(null);
    }
  };


  const onChangeTelefono = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Solo permite números
      setTelefono(value);
    }
  };

  const onChangeConducta = (e) => {
    setConducta(e.target.value);
  };


  // Función para buscar y obtener los datos del usuario
  const handleSearchUser = async (username) => {
    try {
      // Limpia los campos antes de la búsqueda

      setNombre('');
      setApellido('');
      setTelefono('');
      setPlanDependencia('');
      setSemestre('');
      setGenero('');
      setUsername('');



      // Realiza la solicitud al backend
      const response = await api.get(`/nursing-activities/search/${username}`);
      const userData = response.data;

      // Verifica qué contiene `response.data` (por ejemplo, imprime en consola)
      console.log('Respuesta del backend:', userData);

      // Actualiza los estados con los datos obtenidos del backend
      setNombre(userData.name);
      setApellido(userData.lastname);
      setTelefono(userData.phone);
      setPlanDependencia(userData.plan);
      setSemestre(userData.semester);
      setGenero(userData.gender);
      setUsername(userData.username);  // Agregar esta línea si no lo tiene

      message.success('Datos del usuario cargados correctamente');
    } catch (error) {
      console.error('Error al buscar el usuario:', error);
      message.error('Usuario no encontrado');
    }
  };

  const handleRegisterActivity = async () => {
    const payload = {
      date: fecha,
      username: username, // Este es el identificador único
      phone: telefono,
      semester: semestre,
      gender: genero.toUpperCase(), // Asegúrate de enviar en mayúsculas si el backend lo espera así
      diagnostic: diagnostico,
      conduct: conducta,
    };
    console.log('Payload:', payload);

    try {
      const response = await api.post('/nursing-activities/register', payload);
      console.log('Respuesta del backend:', response.data);
      message.success('Actividad registrada exitosamente');
    } catch (error) {
      console.error('Error al registrar la actividad:', error.response ? error.response.data : error);
      message.error('Error al registrar la actividad');
    }
  };


  return (
    <>
      <HeaderNurse />
      <main className="becas-section" style={{ marginTop: '100px' }}>
        <h1 className="text-xl font-bold" style={{ marginBottom: '12px' }}>Registro de Actividades</h1>
        <p style={{ marginBottom: '6px' }}>Aquí se podrán registrar las actividades del usuario en el servicio</p>

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
            <Form layout="vertical">
              <Row gutter={40}>

                <Col span={12}>
                  <Form.Item label="Fecha" labelAlign="left" required>
                    <DatePicker locale={esLocale} onChange={onChangeFecha} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Código/Cédula" labelAlign="left" required>
                    <SearchInputR onSearch={(value) => {
                      setUsername(value); // Actualiza el username con el valor ingresado
                      handleSearchUser(value); // Realiza la búsqueda con el código/cédula
                    }} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Nombre" labelAlign="left" required>
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
                  <Form.Item label="Semestre" labelAlign="left" required>
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
            <Button className="button-cancel">Cancelar</Button>
          </div>
        </Card>
      </main>
    </>
  );
};


export default VisitsNurse;