import {
    TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import {Estado} from 'pages/ventas-claro/estados/domain/Estado';
import {endpoints} from 'config/api';

export class EstadoController extends TransaccionSimpleController<Estado>{
    constructor() {
        super(endpoints.estados_ventas_claro);
    }
}