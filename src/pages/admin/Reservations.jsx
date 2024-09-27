import React from 'react';
import HeaderAdmin from "../../components/admin/HeaderAdmin.jsx";
import SearchInput from '../../components/global/SearchInput.jsx';
import { Card, Space, Button, Input} from 'antd';

const Reservations = () => {
    return (
        <>
            <HeaderAdmin/>
            <main style={{ marginTop: '100px', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
                <Card
                    bordered={true}
                    style={{ width: '500px', marginTop: '100px', margin: '3px auto', justifyContent: 'center' }}
                >
                    <Space style={{ marginTop: '5px', alignItems: 'center' }}>
                        <h1 className="titleCard">Reservas realizadas</h1>
                    </Space>

                    <p>Aquí puedes buscar las personas que han reservado la beca de alimentación.</p>


                    <SearchInput />


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
