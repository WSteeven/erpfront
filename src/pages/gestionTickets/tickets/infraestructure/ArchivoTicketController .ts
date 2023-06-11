import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController'
import { endpoints } from 'config/api'

export class ArchivoTicketController extends TransaccionSimpleController<Archivo> {
  constructor() {
    super(endpoints.archivos_tickets)
  }
}
