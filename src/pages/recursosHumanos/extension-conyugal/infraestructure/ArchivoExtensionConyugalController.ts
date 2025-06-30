import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'
import { Documento } from 'components/documentos/domain/Documento'

export class ArchivoExtensionConyugalController extends TransaccionSimpleController<Documento> {
  constructor() {
    super(endpoints.archivo_extension_conyugal)
  }
}
