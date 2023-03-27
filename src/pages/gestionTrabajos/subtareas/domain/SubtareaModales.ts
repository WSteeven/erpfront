// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
// import TipoTareaPage from 'tareas/tiposTareas/view/TipoTrabajoPage.vue'
import SubtareaPage from 'gestionTrabajos/subtareas/view/SubtareaPage.vue'
import PausasRealizadasPage from 'pages/gestionTrabajos/subtareas/modules/pausasRealizadas/view/PausasRealizadas.vue'
import GestorArchivoTrabajo from 'gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/view/GestorArchivoSubtareaPage.vue'
import EmergenciaPage from 'formulariosTrabajos/emergencias/view/EmergenciaPage.vue'
import ClienteFinalPage from 'clientesFinales/view/ClienteFinalPage.vue'
import ReagendarPage from 'gestionTrabajos/subtareas/modules/reagendar/view/ReagendarPage.vue'

export class SubtareaModales {
  SubtareaPage: ComponenteModal
  EmergenciaPage: ComponenteModal
  GestorArchivoTrabajo: ComponenteModal
  PausasRealizadasPage: ComponenteModal
  ClienteFinalPage: ComponenteModal
  ReagendarPage: ComponenteModal

  constructor() {
    this.SubtareaPage = markRaw(
      new ComponenteModal('Detalles de la subtarea', SubtareaPage)
    )
    this.EmergenciaPage = markRaw(
      new ComponenteModal('Gestionar avances', EmergenciaPage)
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
  }
}
