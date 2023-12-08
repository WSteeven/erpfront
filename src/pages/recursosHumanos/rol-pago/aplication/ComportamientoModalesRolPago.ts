import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { RolPagoModales } from '../domain/RolPagoModales'

export class ComportamientoModalesRolPago extends ComportamientoModales<RolPagoModales> {
  constructor() {
    super(new RolPagoModales())
  }
}
