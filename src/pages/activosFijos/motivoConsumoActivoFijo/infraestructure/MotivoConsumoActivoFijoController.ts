import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { MotivoConsumoActivoFijo } from '../domain/MotivoConsumoActivoFijo'
import { endpoints } from 'config/api'

export class MotivoConsumoActivoFijoController extends TransaccionSimpleController<MotivoConsumoActivoFijo> {
    constructor() {
        super(endpoints.motivos_consumo_activos_fijos)
    }
}
