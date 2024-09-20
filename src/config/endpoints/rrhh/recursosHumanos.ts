import { Endpoint } from 'shared/http/domain/Endpoint';
import { seleccionContratacionPersonal } from './seleccionContratacionPersonal';

export const recursosHumanos = {
    empleados: new Endpoint('empleados'),

    /***************************************************
     *  Submodulo selección y contratación de personal
     **************************************************/
    ...seleccionContratacionPersonal,

}
