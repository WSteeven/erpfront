import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { DiagnosticoCitaMedica } from '../domain/DiagnosticoCitaMedica'
import { endpoints } from 'config/api'

export class DiagnosticoCitaMedicaController extends TransaccionSimpleController<DiagnosticoCitaMedica>{
  constructor() {
    super(endpoints.diagnosticos_citas_medicas)
  }
}

