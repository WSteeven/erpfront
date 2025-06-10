import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { VacacionModales } from 'recursosHumanos/vacaciones/domain/VacacionModales'

export class ComportamientoModalesVacaciones extends ComportamientoModales<VacacionModales>{
  constructor() {
    super(new VacacionModales())
  }
}
