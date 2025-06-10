import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { TipoEventoBitacora } from '../domain/TipoEventoBitacora'
import { endpoints } from 'config/api'

export class TipoEventoBitacoraController extends TransaccionSimpleController<TipoEventoBitacora> {
    constructor() {
        super(endpoints.tipos_eventos_bitacoras)
    }
}
