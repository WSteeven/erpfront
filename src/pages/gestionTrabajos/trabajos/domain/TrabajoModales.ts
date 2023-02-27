// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
// import TipoTareaPage from 'tareas/tiposTareas/view/TipoTrabajoPage.vue'
//import EmergenciasPage from 'trabajos/modules/gestionarAvances/view/GestionarAvancesPage.vue'
import PausasRealizadasPage from 'trabajos/modules/pausasRealizadas/view/PausasRealizadasPage.vue'
import GestorArchivoTrabajo from 'trabajos/modules/gestorArchivosTrabajos/view/GestorArchivoTrabajoPage.vue'
import EmergenciasPage from 'gestionTrabajos/formulariosTrabajos/emergencias/view/EmergenciaPage.vue'
import ClienteFinalPage from 'clientesFinales/view/ClienteFinalPage.vue'

export class TrabajoModales {
  // TipoTareaPage: ComponenteModal
  EmergenciasPage: ComponenteModal
  GestorArchivoTrabajo: ComponenteModal
  PausasRealizadasPage: ComponenteModal
  ClienteFinalPage: ComponenteModal

  constructor() {
    /* this.TipoTareaPage = markRaw(
      new ComponenteModal('CONSTRUCRED', TipoTareaPage)
    )*/
    this.EmergenciasPage = markRaw(
      new ComponenteModal('Gestionar avances', EmergenciasPage)
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
  }
}
