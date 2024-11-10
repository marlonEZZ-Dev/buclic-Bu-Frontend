import { useCallback, useState } from 'react';
import HeaderNurse from "../../components/nurse/HeaderNurse";
import SearchPicker from '../../components/global/SearchPicker.jsx';
import TablePaginationR from '../../components/global/TablePaginationR.jsx';
import { searchBy } from '../../services/nurse/historyNurse.js';
import { Card } from 'antd';

const HistoryNurse = () => {

    const [activities, setActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [queryValue, setQueryValue] = useState("")
    const [rangeValue, setRangeValue] = useState([])
    const itemsPerPage = 10;

    const filterInfo = useCallback(async () => {
        try{
        let response;
        let existQuery = queryValue.length !== 0
        let existRange = rangeValue && rangeValue.length === 2

        if(existQuery && existRange){
            setRangeValue(rangeValue)
            response = await searchBy({
                name: queryValue, 
                startDate: rangeValue[0], 
                endDate: rangeValue[1]
            })
        } else if(existRange){
            setRangeValue(rangeValue)
            response = await searchBy({
                startDate: rangeValue[0], 
                endDate: rangeValue[1]
            })
        }else if(existQuery){
            response = await searchBy({name: queryValue})
        }
        
        console.log(response)
        setActivities(response)
        }catch(err){
        console.log(err);
        }
    }, [queryValue, rangeValue])

    // useEffect(() => {
    //     console.log(queryValue)
    // }, [queryValue])

    // useEffect(() => {
    //     console.log(rangeValue)
    // }, [rangeValue])

    return (
        <>
            <HeaderNurse />
            <main className="becas-section" style={styles.main}>
                <h1 className="text-xl font-bold">Historial de Actividades</h1>
                <p>Aquí se podrán buscar a los pacientes con las actividades que han realizado en el servicio.</p>
                <Card bordered={true} style={styles.card}>
                    <div style={styles.searchContainer}>
                        <SearchPicker 
                        placeholder='Código/Cédula del paciente'
                        dateRangeValue={rangeValue}
                        onQueryChange={value => setQueryValue(value)}
                        onDateRangeChange={value => setRangeValue(value)}
                        onSearch={filterInfo}
                        />
                    </div>
                    <p style={styles.tableTitle}>Tabla de actividades realizadas</p>
                    <TablePaginationR
                        columns={['Fecha cita', 'Nombre', 'Código/Cédula', 'Detalles cita']}
                        rows={activities}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                    />
                </Card>

            </main>
        </>
    );
};

const styles = {
    main: {
        marginTop: '100px'
    },
    card: {
        width: '100%',
        maxWidth: '700px',
        marginTop: '100px',
        margin: '3px auto',
        justifyContent: 'center'
    },
    searchContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px'
    },
    tableTitle: {
        marginTop: '30px'
    }
};

export default HistoryNurse;
