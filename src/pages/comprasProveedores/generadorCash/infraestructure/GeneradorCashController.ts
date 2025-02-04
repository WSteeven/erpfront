import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { GeneradorCash } from '../domain/GeneradorCash'
import { endpoints } from 'config/api'

export class GeneradorCashController extends TransaccionSimpleController<GeneradorCash> {
    constructor() {
        super(endpoints.generador_cash)
    }
}
