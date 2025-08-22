import {
    TransaccionSimpleController
} from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import {CuentaBancaria} from 'pages/administracion/cuentasBancarias/domain/CuentaBancaria';
import {endpoints} from 'config/api';

export class CuentaBancariaController extends TransaccionSimpleController<CuentaBancaria>{
    constructor() {
        super(endpoints.adm_cuentas_bancarias);
    }
}