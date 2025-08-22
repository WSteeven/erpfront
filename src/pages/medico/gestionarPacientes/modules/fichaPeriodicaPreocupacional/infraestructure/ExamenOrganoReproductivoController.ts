import {
    TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import {endpoints} from 'config/api';
import {
    ExamenOrganoReproductivo
} from 'medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/domain/ExamenOrganoReproductivo';

export class ExamenOrganoReproductivoController extends TransaccionSimpleController<ExamenOrganoReproductivo>{
    constructor() {
        super(endpoints.examenes_organos_reproductivos);
    }
}