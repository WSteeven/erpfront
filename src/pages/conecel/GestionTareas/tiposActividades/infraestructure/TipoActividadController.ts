import {
    TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import {TipoActividad} from 'pages/conecel/GestionTareas/tiposActividades/domain/TipoActividad';
import {endpoints} from 'config/api';

export class TipoActividadController extends TransaccionSimpleController<TipoActividad>{
    constructor() {
        super(endpoints.tipos_actividades_conecel);
    }
}