import {
    TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import {Transaccion} from 'pages/bodega/transacciones/domain/Transaccion';
import {endpoints} from 'config/api';

export class EgresoFiltradoController extends TransaccionSimpleController<Transaccion>{
    constructor() {
        super(endpoints.egresos_filtrados);
    }
}