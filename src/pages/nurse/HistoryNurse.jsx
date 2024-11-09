import { useState } from 'react';
import HeaderNurse from "../../components/nurse/HeaderNurse";
import SearchPicker from '../../components/global/SearchPicker.jsx';
import TablePaginationR from '../../components/global/TablePaginationR.jsx';
import { Card, Button, Modal, Descriptions, Badge, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import api from '../../api';

const HistoryNurse = () => {

    const [activities, setActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    return (
        <>
            <HeaderNurse />
            <main className="becas-section" style={{ marginTop: '100px' }}>
                <h1 className="text-xl font-bold">Historial de Actividades</h1>
                <p>Aquí se podrán buscar a los pacientes con las actividades que han realizado en el servicio.</p>
                <Card bordered={true}
                    style={{
                        width: '100%', maxWidth: '700px', marginTop: '100px', margin: '3px auto', justifyContent: 'center'
                    }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <SearchPicker />
                    </div>
                    <p style={{ marginTop: '30px' }}>Tabla de actividades realizadas</p>
                    <TablePaginationR
                        columns={['Fecha cita', 'Nombre', 'Código/Cédula', 'Detalles cita']}

                    />
                </Card>

            </main >
        </>
    );
};

export default HistoryNurse;
