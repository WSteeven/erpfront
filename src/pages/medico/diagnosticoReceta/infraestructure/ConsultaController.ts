import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Consulta } from '../domain/Consulta'
import { endpoints } from 'config/api'

export class ConsultaController extends TransaccionSimpleController<Consulta>{
  constructor() {
    super(endpoints.consultas)
  }
}

