import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { CitaMedicaModales } from './CitaMedicaModales'

export class ComportamientoModalesCitaMedica extends ComportamientoModales<CitaMedicaModales>{
  constructor() {
    super(new CitaMedicaModales())
  }
}
