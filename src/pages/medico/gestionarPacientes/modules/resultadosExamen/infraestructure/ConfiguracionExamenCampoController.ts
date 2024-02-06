import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { ConfiguracionExamenCampo } from '../domain/ConfiguracionExamenCampo'

export class ConfiguracionExamenCampoController extends TransaccionSimpleController<ConfiguracionExamenCampo>{
  constructor() {
    super(endpoints.configuraciones_examenes_campos)
  }
}
