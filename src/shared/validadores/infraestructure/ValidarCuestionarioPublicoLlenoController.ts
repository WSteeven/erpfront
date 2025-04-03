import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

export class ValidarCuestionarioPublicoLlenoController extends TransaccionSimpleController<any> {
    constructor() {
        super(endpoints.verificar_cuestionario_publico_lleno)
    }
}

