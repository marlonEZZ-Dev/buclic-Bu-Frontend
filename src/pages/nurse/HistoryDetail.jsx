import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge, Descriptions, Card } from "antd";
import HeaderNurse from "../../components/nurse/HeaderNurse";
import api from "../../api";

const HistoryDetail = () => {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);

    useEffect(() => {
        const fetchActivityDetail = async () => {
            try {
                const response = await api.get(`/nursing-activities/activity/${id}`);
                setActivity(response.data);
            } catch (error) {
                console.error("Error fetching activity details:", error);
            }
        };

        fetchActivityDetail();
    }, [id]);

    if (!activity) {
        return <p>Cargando detalles de la actividad...</p>;
    }

    return (
        <>
            <HeaderNurse />
            <main className="becas-section" style={{ marginTop: '100px' }}>
                <h1 className="text-xl font-bold">Historial de Actividades</h1>
                <p>Aquí puede observar los detalles de la actividad que se realizo en el servicio.</p>
                <Card>
                    <Descriptions
                        title="Detalles del Historial"
                        bordered
                        size="middle"
                        layout="horizontal"
                        column={2}
                    >
                        <Descriptions.Item
                            label="Nombre"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.user.name}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Código/Cédula"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.user.username}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Plan/Área Dependencia"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.user.plan}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Semestre"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.user.semester}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Género"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.user.gender}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Teléfono"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.user.phone}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Fecha de Actividad"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.date}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Diagnóstico"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            <Badge status="processing" text={activity.diagnostic} />
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Conducta"
                            labelStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                        >
                            {activity.conduct}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </main>
        </>
    );
};

export default HistoryDetail;