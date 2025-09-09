import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { PlantillaCapacitacion } from '../domain/PlantillaCapacitacion'
import { endpoints } from 'config/api'

export class PlantillaCapacitacionController extends TransaccionSimpleController<PlantillaCapacitacion> {
  constructor() {
    super(endpoints.plantillas_capacitaciones)
  }
}
