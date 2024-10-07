import HeaderPsych from "../../components/psychology/HeaderPsych";
import {Flex, DatePicker} from "antd"

export default function SchedulesPsych(){
    return(
    <>
        <HeaderPsych/>
        <div>
            <h1>Definir Horarios</h1>
            <p>Aquí se puede definir el horario para citas disponibles</p>
        </div>
        <Flex>
            <table>
                <theader>
                    <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                    </tr>
                </theader>
                <tbody>
                    <tr>
                        <td><DatePicker/></td>
                        <td><DatePicker/></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><span>+</span> <a>Agregar hora</a></td>
                    </tr>
                    <tr><span>+</span> <a>Agregar fecha</a></tr>
                </tbody>
            </table>
        </Flex>
    </>
    );
}