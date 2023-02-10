import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Procesador } from '../domain/Procesador'
import { endpoints } from 'config/api'

export class ProcesadorController extends TransaccionSimpleController<Procesador>{
    constructor() {
        super(endpoints.procesadores)
    }
}