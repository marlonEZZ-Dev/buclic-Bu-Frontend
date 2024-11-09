import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"; // Íconos de Ant Design
import styles from "../../styles/psychology/agendaPsych.module.css"; // Usa tu propio estilo

function AssistanceButtons({ appointmentId, onReload }) {
  const handleAssistance = async (status) => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch('http://localhost:8080/appointment-reservation/asistencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',  Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          appointmentId: appointmentId,
          status: status,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const data = await response.json();
      console.log('Respuesta exitosa:', data);

      // Llamar a la función de recarga después de un éxito
      if (onReload) {
        onReload();
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
      <button
        className={styles.buttonCheck}
        onClick={() => handleAssistance(true)} // Llama con `true` al confirmar
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <CheckCircleOutlined style={{ color: 'green', fontSize: '20px' }} />
      </button>
      <button
        className={styles.buttonCross}
        onClick={() => handleAssistance(false)} // Llama con `false` al declinar
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <CloseCircleOutlined style={{ color: 'red', fontSize: '20px' }} />
      </button>
    </div>
  );
}

export default AssistanceButtons;
