import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { PreingresoMaterial } from '../domain/PreingresoMaterial';
import { endpoints } from 'config/api';

export class PreingresoMaterialController extends TransaccionSimpleController<PreingresoMaterial> {
    constructor() {
        super(endpoints.preingresos);
    }
}