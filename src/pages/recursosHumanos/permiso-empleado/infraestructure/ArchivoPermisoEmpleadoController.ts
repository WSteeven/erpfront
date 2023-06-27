import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

export class ArchivoPermisoEmpleadoController extends TransaccionSimpleController<Archivo> {
  constructor() {
    super(endpoints.archivo_permiso_empleado)
  }
}
