import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { AutorizarGastoModales } from '../domain/AutorizarGastoModales'

export class ComportamientoModalesAutorizarGasto extends ComportamientoModales<AutorizarGastoModales> {
  constructor() {
    super(new AutorizarGastoModales())
  }
}
