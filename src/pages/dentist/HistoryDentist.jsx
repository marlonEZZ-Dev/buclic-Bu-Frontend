import { useState, useCallback } from 'react';
import HeaderDentist from "../../components/dentist/HeaderDentist";
import SearchPicker from '../../components/global/SearchPicker.jsx';
import ButtonRefresh from "../../components/admin/ButtonRefresh.jsx"
import TablePaginationR from '../../components/global/TablePaginationR.jsx';
import FooterProfessionals from "../../components/global/FooterProfessionals.jsx";
import { Card, Button, Modal, Descriptions, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import api from '../../api';
import moment from 'moment';

const HistoryDentistry = () => {
    const [activities, setActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [queryValue, setQueryValue] = useState("");
    const [rangeValue, setRangeValue] = useState([]);
    const [messageApi, contextHook] = message.useMessage();
    const itemsPerPage = 10;

    const fetchVisits = useCallback(async (page = 1) => {
        try {
            let params = {
                page: page - 1, // La API probablemente espera una página base-0
                size: itemsPerPage
            };

            if (queryValue) params.username = queryValue;
            if (rangeValue.length === 2) {
                params.startDate = rangeValue[0].format('YYYY-MM-DD');
                params.endDate = rangeValue[1].format('YYYY-MM-DD');
            }

            if (!params.username && (!params.startDate || !params.endDate)) {
                messageApi.error("Debe suministrar el nombre de usuario o el rango de fechas para realizar la búsqueda");
                return;
            }

            const response = await api.get('/odontology-visits', { params });
            console.log('Respuesta completa:', response.data);
            console.log('Content:', response.data.list.content);
            console.log('Total elementos:', response.data.list.totalElements);

            // Asumiendo que la respuesta tiene esta estructura:
            // { content: [...], totalElements: number, totalPages: number }
            const formattedActivities = (response.data.list.content || []).map(activity => ({
                ...activity,
                date: activity.date ? moment(activity.date).format('DD/MM/YYYY') : 'Fecha no disponible',
                fullName: `${activity.user?.name || 'Nombre no disponible'} ${activity.user?.lastName || 'Apellido no disponible'}`,
                document: activity.user?.username || 'Documento no disponible',
            }));

            setActivities(formattedActivities);
            setTotalItems(response.data.list.totalElements || formattedActivities.length);
            setCurrentPage(page);

        } catch (err) {
            console.error("Error fetching visits:", err);
            messageApi.error("Error al obtener los datos de visitas");
        }
    }, [queryValue, rangeValue, messageApi]);

    const showVisitDetail = useCallback(async (visitId) => {
        if (!visitId) {
            messageApi.error("ID de la visita no válido");
            return;
        }
    
        try {
            const response = await api.get(`/odontology-visits/visit/${visitId}`);
            console.log("Detalles recibidos desde el backend:", response.data);
            if (response.data) {
                console.log('Detalles recibidos:', response.data); // Depuración: verifica los datos recibidos.
    
                // Asegúrate de que `name` y `lastName` existen en `response.data`.
                const fullName = [
                    response.data.name || "Nombre no disponible",
                    response.data.lastName || "Apellido no disponible"
                ].join(" ").trim();
    
                const visitDetails = {
                    user: {
                        fullName,
                        document: response.data.username || "Documento no disponible",
                    },
                    date: response.data.date
                        ? moment(response.data.date).format("DD/MM/YYYY")
                        : "Fecha no disponible",
                    plan: response.data.plan || "Plan no disponible",
                    reason: response.data.reason || "Razón no disponible",
                    description: response.data.description || "Descripción no disponible",
                };
    
                setSelectedVisit(visitDetails);
                setIsModalVisible(true);
            } else {
                messageApi.error("No se encontraron detalles para esta visita");
            }
        } catch (error) {
            console.error("Error fetching visit details:", error);
            messageApi.error("Error al obtener los detalles de la visita");
        }
    }, [messageApi]);
    
    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedVisit(null);
    };

    const handlePageChange = (page) => {
        fetchVisits(page);
    };

    const handleRefresh = () => {
        setQueryValue('');
        setRangeValue([]);
        setActivities([]);
        setTotalItems(0);
        setCurrentPage(1);
    };

    const rows = activities.map(visit => [
        visit.date,
        visit.fullName,
        visit.document,
        <Button
            key={visit.id}
            icon={<EyeOutlined />}
            style={{ backgroundColor: '#C20E1A', color: 'white', border: 'none' }}
            onClick={() => showVisitDetail(visit.id)}
        />
    ]);

    const handleSearch = () => {
        fetchVisits(1); // Reset a la primera página cuando se hace una nueva búsqueda
    };

    return (
        <>
            <HeaderDentist />
            {contextHook}
            <main className="becas-section" style={{ marginTop: '100px', textAlign: 'center' }}>
                <h1>Historial de visitas</h1>
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
                            onSearch={handleSearch}
                        />
                        <ButtonRefresh onClick={handleRefresh} />
                    </div>
                    <p style={{ fontWeight: 'bold' }}>Tabla de actividades realizadas</p>
                    <TablePaginationR
                        columns={['Fecha cita', 'Nombre', 'Código/cédula', 'Detalles cita']}
                        rows={rows}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        onPageChange={handlePageChange}
                    />
                </Card>
                <Modal
                    title={
                        <div style={{ color: '#C20E1A', fontSize: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                            Detalles de la visita
                        </div>
                    }
                    open={isModalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                >
                    {selectedVisit ? (
                        <Descriptions bordered size="small" column={1}>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Nombre</span>}>
                                {selectedVisit.user.fullName}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Código/cédula</span>}>
                                {selectedVisit.user.document}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Fecha de visita</span>}>
                                {selectedVisit.date}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Plan/área dependencia</span>}>
                                {selectedVisit.plan}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Motivo</span>}>
                                {selectedVisit.reason}
                            </Descriptions.Item>
                            <Descriptions.Item label={<span style={{ fontWeight: 'bold' }}>Descripción</span>}>
                                {selectedVisit.description}
                            </Descriptions.Item>
                        </Descriptions>
                    ) : (
                        <p>Cargando detalles de la visita...</p>
                    )}
                </Modal>
            </main>
            <FooterProfessionals />
        </>
    );
};

export default HistoryDentistry;