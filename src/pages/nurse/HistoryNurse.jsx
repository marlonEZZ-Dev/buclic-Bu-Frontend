import { useState } from 'react';
import HeaderNurse from "../../components/nurse/HeaderNurse";
import SearchInputR from '../../components/global/SearchInputR.jsx';
import TablePaginationR from '../../components/global/TablePaginationR.jsx';
import { Card, Button, Modal, Descriptions, Badge, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import api from '../../api';

const HistoryNurse = () => {
    const [username, setUsername] = useState('');
    const [activities, setActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null); // Detalles de actividad seleccionada
    const itemsPerPage = 10;

    const handleSearch = async () => {
        try {
            const response = await api.get(`nursing-activities/${username}`);
            setActivities(response.data);
            setCurrentPage(1); // Resetear a la primera página en cada búsqueda
        } catch (error) {
            console.error("Error fetching activities:", error);
            message.error("El usuario no tiene actividades");
        }
    };

    const showActivityDetail = async (activityId) => {
        try {
            const response = await api.get(`/nursing-activities/activity/${activityId}`);
            setSelectedActivity(response.data);
            setIsModalVisible(true); // Abre el modal
        } catch (error) {
            console.error("Error fetching activity details:", error);
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedActivity(null); // Limpia la actividad seleccionada
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
            onClick={() => showActivityDetail(activity.id)}
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

                {/* Modal para mostrar los detalles de la actividad */}
                <Modal
                    title={
                        <div style={{ color: '#C20E1A', fontSize: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                            Detalles de la Actividad
                        </div>
                    }
                    open={isModalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                >
                    {selectedActivity ? (
                        <Descriptions bordered size="small" column={1}>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Nombre</span>} className="descriptions-item">
                                {selectedActivity.user.name}
                            </Descriptions.Item>

                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Código/Cédula</span>} className="descriptions-item">
                                {selectedActivity.user.username}
                            </Descriptions.Item>

                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Plan/Área Dependencia</span>} className="descriptions-item">
                                {selectedActivity.user.plan}
                            </Descriptions.Item>

                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Semestre</span>} className="descriptions-item">
                                {selectedActivity.user.semester}
                            </Descriptions.Item>

                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Género</span>} className="descriptions-item">
                                {selectedActivity.user.gender}
                            </Descriptions.Item>

                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Teléfono</span>} className="descriptions-item">
                                {selectedActivity.user.phone}
                            </Descriptions.Item>

                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Fecha de Actividad</span>} className="descriptions-item">
                                {selectedActivity.date}
                            </Descriptions.Item>

                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Diagnóstico</span>} className="descriptions-item">
                                <Badge status="processing" text={selectedActivity.diagnostic} />
                            </Descriptions.Item>

                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Conducta</span>} className="descriptions-item">
                                {selectedActivity.conduct}
                            </Descriptions.Item>
                        </Descriptions>
                    ) : (
                        <p>Cargando detalles de la actividad...</p>
                    )}
                </Modal>
            </main >
        </>
    );
};

export default HistoryNurse;
