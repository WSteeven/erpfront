import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { AtrasosModales } from 'controlPersonal/atrasos/domain/AtrasosModales'

export class ComportamientoModalesAtrasos extends ComportamientoModales<AtrasosModales>{
  constructor() {
    super(new AtrasosModales())
  }
}
