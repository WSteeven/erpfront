import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { ActividadBitacora } from '../domain/ActividadBitacora'
import { endpoints } from 'config/api'

export class ActividadBitacoraController extends TransaccionSimpleController<ActividadBitacora> {
    constructor() {
        super(endpoints.actividades_bitacoras)
    }
}
