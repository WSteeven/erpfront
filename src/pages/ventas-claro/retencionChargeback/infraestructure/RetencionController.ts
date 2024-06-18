import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Retencion } from '../domain/Retencion';
import { endpoints } from 'config/api';

export class RetencionController extends TransaccionSimpleController<Retencion> {
    constructor() {
        super(endpoints.retenciones_chargebacks)
    }
}