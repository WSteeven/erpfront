// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ArchivoSubtarea from 'pages/tareas/controlTareas/modules/subtareasListadoContent/modules/gestorArchivosSubtareas/view/ArchivoSubtareaPage.vue'
import GestionarAvancesPage from 'subtareas/modules/gestionarAvances/view/GestionarAvancesPage.vue'
import SubtareasPage from 'subtareas/view/SubtareaPage.vue'

export class SubtareaListadoContentModales {
  SubtareasPage: ComponenteModal
  GestionarAvancesPage: ComponenteModal
  ArchivoSubtarea: ComponenteModal

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
  }
}
