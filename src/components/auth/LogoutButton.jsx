import React, { useState } from 'react';
import { Button, Typography, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import Modal from '../global/Modal'; 

const { Text } = Typography;

export default function LogoutButton() {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const buttonStyle = {
        backgroundColor: (isHovered || isActive) ? 'white' : '#C20E1A',
        color: (isHovered || isActive) ? '#C20E1A' : 'white',
        borderRadius: '8px',
        border: 'none',
        padding: '10px 20px',  // Igual que en MenuButton
        cursor: 'pointer',
        transition: 'background-color 0.3s, color 0.3s',
        margin: '5px',         // Igual que en MenuButton
        fontFamily: 'Open Sans, sans-serif', // Aplicar Open Sans aquí
    };

    return (
        <>
            <button
                onClick={handleOpenModal}
                onMouseEnter={() => setIsHovered(true)} // Cambia el estado de hover al pasar el mouse
                onMouseLeave={() => setIsHovered(false)} // Cambia el estado de hover al quitar el mouse
                onMouseDown={() => setIsActive(true)} // Cambia el estado de active al hacer clic
                onMouseUp={() => setIsActive(false)} // Cambia el estado de active al soltar el clic
                style={buttonStyle}
            >
                <LogoutOutlined style={{ marginRight: '8px' }} />
                Cerrar Sesión
            </button>

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                modalTitle="Cerrar sesión"
            >
                <Text 
                    type="secondary" 
                    style={{ 
                        fontFamily: 'Open Sans, sans-serif', 
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
                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="primary"
                        danger
                        href='/login'
                        loading={loading}
                        onClick={() => { handleOpenModal(); setLoading(true); }}
                        style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                        Salir
                    </Button>
                </Space>
            </Modal>
        </>
    );
}
