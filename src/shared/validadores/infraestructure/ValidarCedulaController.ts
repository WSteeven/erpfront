import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

export class ValidarCedulaController extends TransaccionSimpleController<any> {
    constructor() {
        super(endpoints.validar_cedula)
    }
}

