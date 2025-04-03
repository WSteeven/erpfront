import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { FichaRetiro } from '../domain/FichaRetiro'
import { endpoints } from 'config/api'

export class InformacionDefectoFichaRetiroController extends TransaccionSimpleController<FichaRetiro> {
  constructor() {
    super(endpoints.fichas_retiro_consultar_informacion_defecto)
  }
}

