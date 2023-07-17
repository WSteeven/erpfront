// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
// import TipoTareaPage from 'tareas/tiposTareas/view/TipoTrabajoPage.vue'
import SubtareaPage from 'gestionTrabajos/subtareas/view/SubtareaPage.vue'
import PausasRealizadasPage from 'pages/gestionTrabajos/subtareas/modules/pausasRealizadas/view/PausasRealizadas.vue'
import GestorArchivoTrabajo from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/view/ArchivoSeguimiento.vue'
import SeguimientoSubtareaPage from 'formulariosTrabajos/emergencias/view/SeguimientoSubtareaPage.vue'
import ClienteFinalPage from 'clientesFinales/view/ClienteFinalPage.vue'
import ReagendarPage from 'gestionTrabajos/subtareas/modules/reagendar/view/ReagendarPage.vue'
import ControlTendidoPage from 'formulariosTrabajos/tendidos/controlTendidos/view/ControlTendidoPage.vue'

export class SubtareaModales {
  SubtareaPage: ComponenteModal
  SeguimientoSubtareaPage: ComponenteModal
  GestorArchivoTrabajo: ComponenteModal
  PausasRealizadasPage: ComponenteModal
  ClienteFinalPage: ComponenteModal
  ReagendarPage: ComponenteModal
  ControlTendido: ComponenteModal

  constructor() {
    this.SubtareaPage = markRaw(
      new ComponenteModal('Detalles', SubtareaPage)
    )

    this.SeguimientoSubtareaPage = markRaw(
      new ComponenteModal('Gestionar avances', SeguimientoSubtareaPage)
    )

    this.GestorArchivoTrabajo = markRaw(
      new ComponenteModal('Compartir archivos para el trabajo', GestorArchivoTrabajo)
    )

    this.PausasRealizadasPage = markRaw(
      new ComponenteModal('Pausas realizadas', PausasRealizadasPage)
    )

    this.ClienteFinalPage = markRaw(
      new ComponenteModal('Clientes finales', ClienteFinalPage)
    )
    this.ReagendarPage = markRaw(new ComponenteModal('Reagendar', ReagendarPage))

    this.ControlTendido = markRaw(
      new ComponenteModal('Construcción', ControlTendidoPage)
    )
  }
}
