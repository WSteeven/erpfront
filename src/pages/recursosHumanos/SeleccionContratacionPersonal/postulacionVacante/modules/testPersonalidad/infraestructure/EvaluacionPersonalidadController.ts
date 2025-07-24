import {
    TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import {
    EvaluacionPersonalidad
} from 'seleccionContratacion/postulacionVacante/modules/testPersonalidad/domain/EvaluacionPersonalidad';
import {endpoints} from 'config/api';

export class EvaluacionPersonalidadController extends TransaccionSimpleController<EvaluacionPersonalidad>{
    constructor() {
        super(endpoints.evaluaciones_personalidades);
    }
}