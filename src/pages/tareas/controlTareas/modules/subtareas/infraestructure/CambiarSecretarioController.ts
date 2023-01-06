import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

// Sólo se usa POST
export class CambiarSecretarioController extends TransaccionSimpleController<any> {
  constructor() {
    super(endpoints.intercambiar_secretario_cuadrilla)
  }
}
