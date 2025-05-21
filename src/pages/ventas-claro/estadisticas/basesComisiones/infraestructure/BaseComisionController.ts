import {
    TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import {BaseComision} from 'pages/ventas-claro/estadisticas/basesComisiones/domain/BaseComision';
import {endpoints} from 'config/api';

export class BaseComisionController extends TransaccionSimpleController<BaseComision>{
    constructor() {
        super(endpoints.bases_comisiones);
    }
}