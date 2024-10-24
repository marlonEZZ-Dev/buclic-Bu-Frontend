import { Modal, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const ReusableModal = ({
  title = "Confirmar acción",  // Título dinámico
  content = "¿Estás seguro de realizar esta acción?",  // Contenido dinámico
  cancelText = "Cancelar",  // Texto del botón de cancelar
  confirmText = "Guardar",  // Texto del botón de confirmar
  onCancel,  // Función para manejar cancelación
  onConfirm  // Función para manejar confirmación
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    if (onCancel) {
      onCancel(); // Llamar a la función de cancelar pasada como prop si existe
    }
  };

  const handleConfirm = () => {
    setModalVisible(false);
    if (onConfirm) {
      onConfirm(); // Llamar a la función de confirmar pasada como prop si existe
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Abrir Modal
      </Button>

      <Modal
        open={modalVisible}
        onCancel={handleCancel} // Cerrar el modal al hacer clic en cancelar
        footer={null} // Elimina el footer por defecto de Ant Design
        title={
          <span>
            <InfoCircleOutlined style={{ color: '#faad14', marginRight: '8px', fontSize: '24px' }} /> {/* Icono de advertencia */}
            <span style={{ fontWeight: 'bold' }}>{title}</span> {/* Título dinámico */}
          </span>
        }
      >
        <p style={{ textAlign: 'left', paddingLeft: '31px' }}>
          {content} {/* Contenido dinámico */}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          {/* Botón Cancelar */}
          <Button className="button-cancel" onClick={handleCancel}>
            {cancelText} {/* Texto del botón de cancelar */}
          </Button>

          {/* Botón Guardar o Confirmar */}
          <Button className="button-save" type="primary" onClick={handleConfirm}>
            {confirmText} {/* Texto del botón de confirmar */}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ReusableModal;

