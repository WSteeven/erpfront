import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { CategoriaMotivoConsumoActivoFijo } from '../domain/CategoriaMotivoConsumoActivoFijo'
import { endpoints } from 'config/api'

export class CategoriaMotivoConsumoActivoFijoController extends TransaccionSimpleController<CategoriaMotivoConsumoActivoFijo> {
    constructor() {
        super(endpoints.categorias_motivos_consumo_activos_fijos)
    }
}
