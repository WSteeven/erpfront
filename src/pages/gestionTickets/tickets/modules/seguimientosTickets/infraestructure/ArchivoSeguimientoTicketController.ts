import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { endpoints } from 'config/api'

export class ArchivoSeguimientoTicketController extends TransaccionSimpleController<Archivo> {
  constructor() {
    super(endpoints.archivos_seguimientos_tickets)
  }
}
