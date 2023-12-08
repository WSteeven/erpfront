// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import DetalleTrabajoAsignadoPage from 'gestionTrabajos/trabajoAsignado/modules/detalleTrabajosAsignados/view/DetalleTrabajoAsignadoPage.vue'
import SeguimientoSubtareaPage from 'formulariosTrabajos/emergencias/view/SeguimientoSubtareaPage.vue'
import GuiaSubtareasPage from 'gestionTrabajos/trabajoAsignado/modules/guiaSubtareas/GuiaSubtareasPage.vue'

export class TrabajoAsignadoModales {
  DetalleTrabajoAsignadoPage: ComponenteModal
  SeguimientoSubtareaPage: ComponenteModal
  GuiaSubtareasPage: ComponenteModal

  constructor() {
    this.DetalleTrabajoAsignadoPage = markRaw(
      new ComponenteModal('Detalles del trabajo', DetalleTrabajoAsignadoPage)
    )

    this.SeguimientoSubtareaPage = markRaw(
      new ComponenteModal('Seguimiento', SeguimientoSubtareaPage)
    )

    this.GuiaSubtareasPage = markRaw(
      new ComponenteModal('¿Cómo funcionan los estados de las subtareas?', GuiaSubtareasPage)
    )
  }
}
