import { endpoints } from 'config/api';
import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';

export class AsignarPermisosIndividualController extends TransaccionSimpleController<any> {
    constructor() {
        super(endpoints.asignar_permisos_individual)
    }
}