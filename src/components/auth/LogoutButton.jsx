import React, { useState } from 'react';
import { Button, Typography, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import Modal from '../global/Modal'; 

const { Text } = Typography;

export default function LogoutButton() {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button
                icon={<LogoutOutlined />}
                onClick={handleOpenModal}
                type="text"
                size="small"
                style={{ fontFamily: 'Open Sans, sans-serif' }}  // Aplicar Open Sans aquí
            >
                Cerrar Sesión
            </Button>

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                modalTitle="Cerrar sesión"
            >
                <Text 
                    type="secondary" 
                    style={{ 
                        fontFamily: 'Open Sans, sans-serif',  // Aplicar Open Sans aquí
                        minWidth: '500px', 
                        display: 'block', 
                        marginBottom: '16px' 
                    }}
                >
                    ¿Está seguro que desea cerrar sesión?
                </Text>
                <Space direction="horizontal" style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button
                        onClick={handleCloseModal}
                        style={{ fontFamily: 'Open Sans, sans-serif' }}  // Aplicar Open Sans aquí
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="primary"
                        danger
                        href='/login'
                        loading={loading}
                        onClick={() => { handleOpenModal(); setLoading(true); }}
                        style={{ fontFamily: 'Open Sans, sans-serif' }}  // Aplicar Open Sans aquí
                    >
                        Salir
                    </Button>
                </Space>
            </Modal>
        </>
    );
}
