import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import {
  BitacoraVehicularModales
} from 'vehiculos/bitacoraVehicular/domain/BitacoraVehicularModales'

export class ComportamientoModalesBitacoraVehicular extends ComportamientoModales<BitacoraVehicularModales> {
  constructor() {
    super(new BitacoraVehicularModales())
  }
}
