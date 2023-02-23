// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
// import TipoTareaPage from 'tareas/tiposTareas/view/TipoTrabajoPage.vue'
import EmergenciasPage from 'tareas/controlTareas/modules/subtareas/modules/gestionarAvances/view/GestionarAvancesPage.vue'
import PausasRealizadasPage from 'tareas/controlTareas/modules/subtareas/modules/gestionarAvances/modules/pausasRealizadas/view/PausasRealizadasPage.vue'
import ArchivoSubtarea from 'tareas/controlTareas/modules/subtareasListadoContnt/modules/gestorArchivosSubtareas/view/ArchivoSubtareaPage.vue'
//import SubtareasPage from 'subtareas/view/SubtareaPage.vue'
import EmergenciaPage from 'subtareas/modules/controlAvance/view/EmergenciaPage.vue'
import ClienteFinalPage from 'tareas/clientesFinales/view/ClienteFinalPage.vue'

export class TrabajoModales {
  // TipoTareaPage: ComponenteModal
  // SubtareasPage: ComponenteModal
  EmergenciasPage: ComponenteModal
  GestionarAvancesPage: ComponenteModal
  ArchivoSubtarea: ComponenteModal
  PausasRealizadasPage: ComponenteModal
  ClienteFinalPage: ComponenteModal

  constructor() {
    /* this.TipoTareaPage = markRaw(
      new ComponenteModal('CONSTRUCRED', TipoTareaPage)
    )*/
    this.EmergenciasPage = markRaw(
      new ComponenteModal('Gestionar avances', EmergenciasPage)
    )
    /*this.SubtareasPage = markRaw(
      new ComponenteModal('Detalles del trabajo', SubtareasPage)
    )*/
    this.GestionarAvancesPage = markRaw(
      new ComponenteModal('Emergencias', EmergenciaPage)
    )
    this.ArchivoSubtarea = markRaw(
      new ComponenteModal('Compartir archivos para el trabajo', ArchivoSubtarea)
    )
    this.PausasRealizadasPage = markRaw(
      new ComponenteModal('Pausas realizadas', PausasRealizadasPage)
    )
    this.ClienteFinalPage = markRaw(
      new ComponenteModal('Clientes finales', ClienteFinalPage)
    )
  }
}
