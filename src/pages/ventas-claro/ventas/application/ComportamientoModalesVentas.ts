import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { VentasModales } from '../domain/VentasModales'

export class ComportamientoModalesVentas extends ComportamientoModales<VentasModales> {
  constructor() {
    super(new VentasModales())
  }
}
