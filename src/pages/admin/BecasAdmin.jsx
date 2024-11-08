import React, { useState, useEffect } from 'react';
import HeaderAdmin from '../../components/admin/HeaderAdmin';
import ReusableModal from '../../components/global/ReusableModal';
import { Button, Col, Form, Card, Space, Row, Input, message } from 'antd';
import api from '../../api';
import SearchInputR from '../../components/global/SearchInputR';

const BecasAdmin = () => {


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
            <Form layout="vertical">

              <Row gutter={40}>

                <Col span={12}>
                  <Form.Item label="Cédula" labelAlign="left" required >
                    <SearchInputR />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Nombre" labelAlign="left" required>
                    <Input
                      placeholder="Ingrese el nombre"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Apellido" labelAlign="left" required>
                    <Input
                      placeholder="Ingrese el apellido"
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Área Dependencia" labelAlign="left" required>
                    <Input
                      placeholder="Ingrese el área de dependencia"

                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Correo" labelAlign="left" name="email" required
                    rules={[
                      {
                        required: true,
                        message: 'Por favor ingrese su correo electrónico',
                      },
                      {
                        type: 'email',
                        message: 'Por favor ingrese un correo electrónico válido correo@mail.com',
                      },
                    ]}
                  >
                    <Input type="email" placeholder="Ingrese el correo"
                    />
                  </Form.Item>
                </Col>

              </Row>
            </Form>
          </Space>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button className="button-save" >Guardar</Button>
            <Button className="button-cancel">Cancelar</Button>
          </div>
        </Card>

      </main>
    </>
  );
};

export default BecasAdmin;