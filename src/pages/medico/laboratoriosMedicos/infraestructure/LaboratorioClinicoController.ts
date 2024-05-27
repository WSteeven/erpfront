import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { LaboratorioClinico } from '../domain/LaboratorioClinico'
import { endpoints } from 'config/api'

export class LaboratorioClinicoController extends TransaccionSimpleController<LaboratorioClinico>{
  constructor() {
    super(endpoints.laboratorios_clinicos)
  }
}

