import {
    TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import {Progresiva} from 'pages/appenate/telconet/progresivas/domain/Progresiva';
import {endpoints} from 'config/api';

export class ProgresivaController extends TransaccionSimpleController<Progresiva>{
    constructor() {
        super(endpoints.progresivas);
    }
}