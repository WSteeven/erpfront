import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

// Sólo se usa POST
export class CambiarJefeCuadrillaController extends TransaccionSimpleController<any> {
  constructor() {
    super(endpoints.intercambiar_jefe_cuadrilla)
  }
}
