import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { AcreditacionSemanaModales } from '../domain/AcreditacionSemanaModales'

export class ComportamientoModalesAcreditacionSemanas extends ComportamientoModales<AcreditacionSemanaModales> {
  constructor() {
    super(new AcreditacionSemanaModales())
  }
}
