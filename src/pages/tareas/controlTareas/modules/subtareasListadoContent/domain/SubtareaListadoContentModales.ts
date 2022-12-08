// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import SubtareasPage from 'pages/tareas/subtareas/view/SubtareaPage.vue'
import GestionarAvancesPage from 'pages/tareas/subtareas/modules/gestionarAvances/view/GestionarAvancesPage.vue'
import GestorArchivoSubtareaPage from 'pages/tareas/controlTareas/modules/subtareasListadoContent/modules/gestorArchivosSubtareas/view/GestorArchivoSubtareaPage.vue'

export class SubtareaListadoContentModales {
  SubtareasPage: ComponenteModal
  GestionarAvancesPage: ComponenteModal
  GestorArchivoSubtareaPage: ComponenteModal

  constructor() {
    this.SubtareasPage = markRaw(
      new ComponenteModal('CONSTRUCRED', SubtareasPage)
    )
    this.GestionarAvancesPage = markRaw(
      new ComponenteModal('CONSTRUCRED', GestionarAvancesPage)
    )
    this.GestorArchivoSubtareaPage = markRaw(
      new ComponenteModal('Compartir archivos para la subtarea', GestorArchivoSubtareaPage)
    )
  }
}
