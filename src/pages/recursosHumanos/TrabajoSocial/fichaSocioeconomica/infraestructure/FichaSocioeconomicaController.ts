import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { FichaSocioeconomica } from 'trabajoSocial/fichaSocioeconomica/domain/FichaSocioeconomica'
import { endpoints } from 'config/api'

export class FichaSocioeconomicaController extends TransaccionSimpleController<FichaSocioeconomica>{
  constructor() {
    super(endpoints.fichas_socioeconomicas)
  }
}
