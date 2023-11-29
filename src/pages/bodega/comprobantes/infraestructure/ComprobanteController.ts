import { endpoints } from 'config/api';
import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { Comprobante } from '../domain/Comprobante';

export class ComprobanteController extends TransaccionSimpleController<Comprobante>{
    constructor(){
        super(endpoints.comprobantes)
    }
}