import HeaderNurse from "../../components/nurse/HeaderNurse";
import SearchInputR from '../../components/global/SearchInputR.jsx';
import TablePaginationR from '../../components/global/TablePaginationR.jsx';

import { Card } from 'antd';

const HistoryNurse = () => {

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
                        <SearchInputR />
                    </div>

                    <p style={{ marginTop: '30px'}}>Tabla de actividades realizadas</p>

                    <TablePaginationR>
                        columns={['Fecha cita', 'Nombre', 'Código/Cédula','Detalles cita']}
                    </TablePaginationR>

                </Card>
            </main>
        </>
    );
};

export default HistoryNurse;