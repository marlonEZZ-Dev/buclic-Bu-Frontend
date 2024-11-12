import { useState, useCallback } from 'react';
import HeaderDentist from "../../components/dentist/HeaderDentist";
import SearchPicker from '../../components/global/SearchPicker.jsx';
import ButtonRefresh from "../../components/admin/ButtonRefresh.jsx"
import TablePaginationR from '../../components/global/TablePaginationR.jsx';
import { Card, Button, Modal, Descriptions, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import api from '../../api'; // Asegúrate de que esta instancia esté configurada con el baseURL adecuado.
import moment from 'moment'; // Importamos moment para formatear fechas

const HistoryDentistry = () => {
    const [activities, setActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [queryValue, setQueryValue] = useState("");
    const [rangeValue, setRangeValue] = useState([]);
    const [messageApi, contextHook] = message.useMessage();
    const itemsPerPage = 10;

    const fetchVisits = useCallback(async () => {
        try {
            let params = {};
            if (queryValue) params.username = queryValue; // Utilizar queryValue para el parámetro de búsqueda
            if (rangeValue.length === 2) {
                params.startDate = rangeValue[0].format('YYYY-MM-DD');
                params.endDate = rangeValue[1].format('YYYY-MM-DD');
            }

            if (!params.username && (!params.startDate || !params.endDate)) {
                messageApi.error("Debe suministrar el nombre de usuario o el rango de fechas para realizar la búsqueda");
                return;
            }

            const response = await api.get('/odontology-visits', { params });

            // Aseguramos que los datos estén definidos y formateamos adecuadamente
            const formattedActivities = (response.data.list.content || []).map(activity => ({
                ...activity,
                date: activity.date ? moment(activity.date).format('DD/MM/YYYY') : 'Fecha no disponible', // Formateamos la fecha a "DD/MM/YYYY" si está presente
                fullName: `${activity.user?.name || 'Nombre no disponible'} ${activity.user?.lastname || 'Apellido no disponible'}`, // Concatenamos nombre y apellido si están presentes
                document: activity.user?.document || 'Documento no disponible', // Mostramos el documento si está presente
            }));
            setActivities(formattedActivities);
        } catch (err) {
            console.error("Error fetching visits:", err);
            messageApi.error("Error al obtener los datos de visitas");
        }
    }, [queryValue, rangeValue]);

    const showVisitDetail = async (visitId) => {
        try {
            const response = await api.get(`/visit/${visitId}`);
            setSelectedVisit(response.data);
            setIsModalVisible(true);
        } catch (error) {
            console.error("Error fetching visit details:", error);
            messageApi.error("Error al obtener los detalles de la visita");
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedVisit(null);
    };

    const paginatedActivities = activities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const rows = paginatedActivities.map(visit => [
        visit.date,
        visit.fullName,
        visit.document, // Mostramos el documento en la tabla
        <Button
            icon={<EyeOutlined />}
            style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
            onClick={() => showVisitDetail(visit.id)}
        />
    ]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <HeaderDentist /> {/* Header específico de odontología */}
            {contextHook}
            <main style={{ marginTop: '100px', textAlign: 'center' }}>
                <h1 style={{ color: '#C20E1A', fontSize: '24px', fontWeight: 'bold' }}>Historial de visitas</h1>
                <p>Aquí se podrán buscar las visitas por paciente o fecha que se han realizado en el servicio.</p>
                <Card
                    bordered={true}
                    style={{
                        width: '100%',
                        maxWidth: '700px',
                        margin: '20px auto',
                        padding: '20px',
                        textAlign: 'left',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <SearchPicker
                            placeholder="Código/Cédula del paciente"
                            dateRangeValue={rangeValue}
                            queryValue={queryValue}
                            onQueryChange={value => setQueryValue(value)}
                            onDateRangeChange={value => setRangeValue(value)}
                            onSearch={fetchVisits}
                        />
                        <ButtonRefresh
                            onClick={() => {
                                setQueryValue('');
                                setRangeValue([]);
                                setActivities([]);
                            }}
                        />
                    </div>
                    <p style={{ fontWeight: 'bold' }}>Tabla de actividades realizadas</p>
                    <TablePaginationR
                        columns={['Fecha cita', 'Nombre', 'Código/Cédula', 'Detalles cita']}
                        rows={rows}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={activities.length}
                        onPageChange={handlePageChange}
                    />
                </Card>
                {/* Modal para detalles de la visita */}
                <Modal
                    title={
                        <div style={{ color: '#C20E1A', fontSize: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                            Detalles de la Visita
                        </div>
                    }
                    open={isModalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                >
                    {selectedVisit ? (
                        <Descriptions bordered size="small" column={1}>
                            <Descriptions.Item label="Nombre">{`${selectedVisit.user?.name || ''} ${selectedVisit.user?.lastname || ''}`}</Descriptions.Item>
                            <Descriptions.Item label="Código/Cédula">{selectedVisit.user?.document || 'Documento no disponible'}</Descriptions.Item>
                            <Descriptions.Item label="Fecha de visita">{moment(selectedVisit.date).format('DD/MM/YYYY')}</Descriptions.Item>
                            <Descriptions.Item label="Diagnóstico">{selectedVisit.diagnostic}</Descriptions.Item>
                            <Descriptions.Item label="Conducta">{selectedVisit.conduct}</Descriptions.Item>
                        </Descriptions>
                    ) : (
                        <p>Cargando detalles de la visita...</p>
                    )}
                </Modal>
            </main>
        </>
    );
};

export default HistoryDentistry;