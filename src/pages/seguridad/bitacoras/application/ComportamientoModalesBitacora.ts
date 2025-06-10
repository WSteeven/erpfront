import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { BitacoraModales } from '../doman/BitacoraModales'

export class ComportamientoModalesBitacora extends ComportamientoModales<BitacoraModales> {
  constructor() {
    super(new BitacoraModales())
  }
}
