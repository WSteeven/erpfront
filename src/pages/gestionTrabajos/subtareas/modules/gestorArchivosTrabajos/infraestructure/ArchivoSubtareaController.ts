import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Archivo } from 'trabajos/modules/gestorArchivosTrabajos/domain/Archivo'
import { endpoints } from 'config/api'

export class ArchivoSubtareaController extends TransaccionSimpleController<Archivo> {
  constructor() {
    super(endpoints.archivos_subtareas)
  }
}
