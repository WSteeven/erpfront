import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { DatoBancario } from '../domain/DatoBancario';
import { endpoints } from 'config/api';

export class DatoBancarioController extends TransaccionSimpleController<DatoBancario> {
    constructor() {
        super(endpoints.datos_bancarios_proveedor)
    }
}