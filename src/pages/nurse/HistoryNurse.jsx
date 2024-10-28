import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNurse from "../../components/nurse/HeaderNurse";
import SearchInputR from '../../components/global/SearchInputR.jsx';
import TablePaginationR from '../../components/global/TablePaginationR.jsx';
import { Card, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import api from '../../api';

const HistoryNurse = () => {
    const [username, setUsername] = useState('');
    const [activities, setActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const handleSearch = async () => {
        try {
            const response = await api.get(`nursing-activities/${username}`);
            setActivities(response.data);
            setCurrentPage(1); // Resetear a la primera página en cada búsqueda
        } catch (error) {
            console.error("Error fetching activities:", error);
        }
    };

    const paginatedActivities = activities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const rows = paginatedActivities.map(activity => [
        activity.date,
        activity.user.name,
        activity.user.username,
        <Button
            icon={<EyeOutlined />}
            style={{ backgroundColor: '#C20E1A', color: 'white', marginRight: 8, border: 'none' }}
            onClick={() => navigate(`/enfermeria/detallesHistorial/${activity.id}`)}
        />
    ]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

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
                        <SearchInputR
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onSearch={handleSearch}
                        />
                    </div>
                    <p style={{ marginTop: '30px' }}>Tabla de actividades realizadas</p>
                    <TablePaginationR
                        columns={['Fecha cita', 'Nombre', 'Código/Cédula', 'Detalles cita']}
                        rows={rows}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={activities.length}
                        onPageChange={handlePageChange}
                    />
                </Card>
            </main>
        </>
    );
};

export default HistoryNurse;
