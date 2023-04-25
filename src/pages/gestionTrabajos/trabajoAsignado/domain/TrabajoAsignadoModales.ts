// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import DetalleTrabajoAsignadoPage from 'gestionTrabajos/trabajoAsignado/modules/detalleTrabajosAsignados/view/DetalleTrabajoAsignadoPage.vue'
import EmergenciaPage from 'formulariosTrabajos/emergencias/view/EmergenciaPage.vue'
import GuiaSubtareasPage from 'gestionTrabajos/trabajoAsignado/modules/guiaSubtareas/GuiaSubtareasPage.vue'

export class TrabajoAsignadoModales {
  DetalleTrabajoAsignadoPage: ComponenteModal
  EmergenciaPage: ComponenteModal
  GuiaSubtareasPage: ComponenteModal

  constructor() {
    this.DetalleTrabajoAsignadoPage = markRaw(
      new ComponenteModal('Detalles del trabajo', DetalleTrabajoAsignadoPage)
    )

    this.EmergenciaPage = markRaw(
      new ComponenteModal('Seguimiento', EmergenciaPage)
    )

    this.GuiaSubtareasPage = markRaw(
      new ComponenteModal('¿Cómo funcionan los estados de las subtareas?', GuiaSubtareasPage)
    )
  }
}
