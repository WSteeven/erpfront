import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { MultaConductor } from '../domain/MultaConductor';
import { endpoints } from 'config/api';

export class MultaConductorController extends TransaccionSimpleController<MultaConductor> {
    constructor() {
        super(endpoints.multas_conductores)
    }
}