import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Documento } from 'components/documentos/domain/Documento'

export class ArchivoRolPagoMesController extends TransaccionSimpleController<Documento> {
  constructor() {
    super(endpoints.archivo_rol_pago_mes)
  }
}
