import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Actividad } from '../domain/Actividad';
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';
import { endpoints } from 'config/api';

export class ActividadController extends TransaccionSimpleController<Actividad> {
    constructor() {
        super(endpoints.actividades)
    }
}