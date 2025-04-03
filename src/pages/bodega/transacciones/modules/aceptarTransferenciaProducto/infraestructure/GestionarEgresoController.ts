import { endpoints } from 'config/api';
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion';
import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';

export class GestionarEgresoController extends TransaccionSimpleController<Transaccion> {
    constructor() {
        super(endpoints.gestionar_egresos)
    }
}