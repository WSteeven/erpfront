import {
    TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import {Tarea} from 'pages/conecel/GestionTareas/tareas/domain/Tarea';
import {endpoints} from 'config/api';

export class TareaController extends TransaccionSimpleController<Tarea>{
    constructor() {
        super(endpoints.tareas_conecel);
    }
}