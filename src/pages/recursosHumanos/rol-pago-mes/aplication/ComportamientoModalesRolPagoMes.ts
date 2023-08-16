import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { RolPagoMesModales } from '../domain/RolPagoMesModales'

export class ComportamientoModalesRolPagoMes extends ComportamientoModales<RolPagoMesModales> {
  constructor() {
    super(new RolPagoMesModales())
  }
}
