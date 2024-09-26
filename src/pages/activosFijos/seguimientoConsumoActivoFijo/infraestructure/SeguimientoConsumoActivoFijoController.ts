import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { SeguimientoConsumoActivoFijo } from '../domain/SeguimientoConsumoActivoFijo'
import { endpoints } from 'config/api'

export class SeguimientoConsumoActivoFijoController extends TransaccionSimpleController<SeguimientoConsumoActivoFijo> {
    constructor() {
        super(endpoints.seguimiento_consumo_activos_fijos)
    }
}
