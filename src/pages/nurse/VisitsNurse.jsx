import React, { useEffect, useState } from 'react';
import HeaderNurse from "../../components/nurse/HeaderNurse.jsx";
import esLocale from 'antd/es/date-picker/locale/es_ES';
import SearchInputR from '../../components/global/SearchInputR.jsx';
import { DatePicker, Form, Card, Space, Input, Select, Row, Col, Button, message } from "antd";


export default function VisitsNurse() {

  const [fecha, setFecha] = useState(null);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [planDependencia, setPlanDependencia] = useState('');
  const [semestre, setSemestre] = useState('');
  const [conduca, setConduca] = useState('');

  const onChangeFecha = (date, dateString) => {
    setFecha(dateString);
    console.log("Fecha seleccionada:", dateString);
  };

  const onChangeTelefono = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Solo permite números
      setTelefono(value);
    }
  };

  const onChangeConduca = (e) => {
    setConduca(e.target.value); // Actualiza el estado con el valor del input
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
            {/* Fecha y Código/Cédula */}
            <Form layout="vertical">
              <Row gutter={40}>
                <Col span={12}>
                  <Form.Item label="Fecha" labelAlign="left" required>
                    <DatePicker locale={esLocale} onChange={onChangeFecha} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Código/Cédula" labelAlign="left" required>
                    <SearchInputR />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Nombre" labelAlign="left" required>
                    <Input
                      placeholder="Ingrese el nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Teléfono" labelAlign="left" required>
                    <Input
                      placeholder="Ingrese el teléfono"
                      value={telefono}
                      onChange={onChangeTelefono}
                      maxLength={10} // Limita a 10 dígitos
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
                    <Select placeholder="Selecciona una opción" style={{ width: '100%' }}>
                      <Option value="masculino">Masculino</Option>
                      <Option value="femenino">Femenino</Option>
                      <Option value="otro">Otro</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Diagnóstico" labelAlign="left" required>
                    <Select placeholder="Selecciona una opción" style={{ width: '100%' }}>
                      <Option value="colicos-menstruales">Cólicos menstruales</Option>
                      <Option value="curacion">Curación</Option>
                      <Option value="dolor-cabeza">Dolor de cabeza</Option>
                      <Option value="dolor-estomacal">Dolor estomacal</Option>
                      <Option value="dolor-muscular">Dolor muscular</Option>
                      <Option value="malestar-general">Malestar general</Option>
                      <Option value="mareos-desmayos">Mareos/desmayos</Option>
                      <Option value="preservativos">Preservativos</Option>
                      <Option value="otro">Otro</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Conducta" labelAlign="left">
                    <Input.TextArea
                      placeholder="Escribe aquí una descripción larga sobre la conduca"
                      value={conduca}
                      onChange={onChangeConduca}
                      rows={4} // Número de filas visibles
                    />
                  </Form.Item>
                </Col>

              </Row>
            </Form>
          </Space>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button className="button-save" type="primary"> Guardar</Button>
            <Button className="button-cancel">Cancelar</Button>
          </div>
        </Card>


      </main>

    </>
  );
}