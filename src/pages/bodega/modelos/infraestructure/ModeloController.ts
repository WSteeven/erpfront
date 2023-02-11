import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Modelo } from '../domain/Modelo'
import { endpoints } from 'config/api'

export class ModeloController extends TransaccionSimpleController<Modelo>{
    constructor() {
        super(endpoints.modelos)
    }
}