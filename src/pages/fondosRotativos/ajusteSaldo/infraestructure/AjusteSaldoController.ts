import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { AjusteSaldo } from '../domain/AjusteSaldo'
import { endpoints } from 'config/api'

export class AjusteSaldoController extends TransaccionSimpleController<AjusteSaldo> {
    constructor() {
        super(endpoints.ajustes_saldos)

    }
}