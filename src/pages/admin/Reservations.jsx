import React from 'react';
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import SearchInput from '../../components/global/SearchInput.jsx';
import { Card, Space, Button, Descriptions } from 'antd';

const Reservations = () => {

    const person = {
        name: 'John Doe',
        age: 25,
        email: 'john.doe@example.com',
        reservationDate: '2024-09-15',
    };
    return (
        <>
            <HeaderAdmin />
            <main style={{ marginTop: '100px', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
                <Card
                    bordered={true}
                    style={{ width: '500px', marginTop: '100px', margin: '3px auto', justifyContent: 'center' }}
                >
                    <Space style={{ marginTop: '5px', alignItems: 'center' }}>
                        <h1 className="titleCard">Reservas realizadas</h1>
                    </Space>

                    <p>Aquí puedes buscar las personas que han reservado la beca de alimentación.</p>


                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <SearchInput />
                    </div>

                    {/* Información de la persona con Descriptions */}
                    <Descriptions title="Información de la Persona" bordered column={1} style={{ marginTop: '15px' }}>

                        <Descriptions.Item label="Nombre" className="descriptions-item">
                            {person.name}
                        </Descriptions.Item>

                        <Descriptions.Item label="Edad" className="descriptions-item">
                            {person.age}
                        </Descriptions.Item>

                        <Descriptions.Item label="Correo" className="descriptions-item">
                            {person.email}
                        </Descriptions.Item>
                        
                        <Descriptions.Item label="Fecha de Reserva" className="descriptions-item">
                            {person.reservationDate}
                        </Descriptions.Item>
                    </Descriptions>



                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                        <Button type="default" htmlType="submit" className="button-save">Guardar</Button>
                        <Button type="default" htmlType="reset" className="button-cancel">Cancelar</Button>
                    </div>

                </Card>
            </main>
        </>
    );
};

export default Reservations;
