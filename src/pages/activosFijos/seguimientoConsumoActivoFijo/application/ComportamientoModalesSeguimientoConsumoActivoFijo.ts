import { SeguimientoConsumoActivoFijoModales } from '../domain/SeguimientoConsumoActivoFijoModales'
import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'

export class ComportamientoModalesSeguimientoConsumoActivoFijo extends ComportamientoModales<SeguimientoConsumoActivoFijoModales> {
    constructor() {
        super(new SeguimientoConsumoActivoFijoModales())
    }
}