import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { FichaPeriodicaPreocupacional } from '../domain/FichaPeriodicaPreocupacional'
import { endpoints } from 'config/api'

export class InformacionDefectoFichaPreocupacionalController extends TransaccionSimpleController<FichaPeriodicaPreocupacional> {
  constructor() {
    super(endpoints.fichas_preocupacionales_consultar_informacion_defecto)
  }
}

