import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Ubicacion } from '../domain/Ubicacion'
import { endpoints } from 'config/api'

export class UbicacionController extends TransaccionSimpleController<Ubicacion>{
    constructor() {
        super(endpoints.ubicaciones)
    }
}