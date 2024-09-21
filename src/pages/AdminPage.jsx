import {
    Route,
    Routes
} from 'react-router-dom'
import ManagementUsers from './ManagementUsers.jsx';

export default function AdminPage (){
    return(
            <Routes>
                <Route path="/gestionUsuarios" element={ <ManagementUsers/> } />
            </Routes>
    );
}