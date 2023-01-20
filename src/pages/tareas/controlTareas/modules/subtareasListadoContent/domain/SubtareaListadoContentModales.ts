// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import PausasRealizadasPage from 'tareas/controlTareas/modules/subtareas/modules/gestionarAvances/modules/pausasRealizadas/view/PausasRealizadasPage.vue'
import ArchivoSubtarea from 'pages/tareas/controlTareas/modules/subtareasListadoContent/modules/gestorArchivosSubtareas/view/ArchivoSubtareaPage.vue'
import GestionarAvancesPage from 'subtareas/modules/gestionarAvances/view/GestionarAvancesPage.vue'
import SubtareasPage from 'subtareas/view/SubtareaPage.vue'

export class SubtareaListadoContentModales {
  SubtareasPage: ComponenteModal
  GestionarAvancesPage: ComponenteModal
  ArchivoSubtarea: ComponenteModal
  PausasRealizadasPage: ComponenteModal

  constructor() {
    this.SubtareasPage = markRaw(
      new ComponenteModal('Detalles del trabajo', SubtareasPage)
    )
    this.GestionarAvancesPage = markRaw(
      new ComponenteModal('CONSTRUCRED', GestionarAvancesPage)
    )
    this.ArchivoSubtarea = markRaw(
      new ComponenteModal('Compartir archivos para el trabajo', ArchivoSubtarea)
    )
    this.PausasRealizadasPage = markRaw(
      new ComponenteModal('Pausas realizadas', PausasRealizadasPage)
    )
  }
}
