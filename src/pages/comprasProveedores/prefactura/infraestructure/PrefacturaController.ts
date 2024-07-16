import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Prefactura } from '../domain/Prefactura';
import { endpoints } from 'config/api';

export class PrefacturaController extends TransaccionSimpleController<Prefactura> {
    constructor() {
        super(endpoints.prefacturas)
    }
}