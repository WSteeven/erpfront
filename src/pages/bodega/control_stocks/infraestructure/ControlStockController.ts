import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ControlStock } from '../domain/ControlStock'
import { endpoints } from 'config/api'

export class ControlStockController extends TransaccionSimpleController<ControlStock>{
    constructor() {
        super(endpoints.control_stocks)
    }
}