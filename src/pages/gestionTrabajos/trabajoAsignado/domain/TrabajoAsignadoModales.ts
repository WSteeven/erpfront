// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import DetalleTrabajoAsignadoPage from 'gestionTrabajos/trabajoAsignado/modules/detalleTrabajosAsignados/view/DetalleTrabajoAsignadoPage.vue'
import EmergenciaPage from 'formulariosTrabajos/emergencias/view/EmergenciaPage.vue'

export class TrabajoAsignadoModales {
  DetalleTrabajoAsignadoPage: ComponenteModal
  EmergenciaPage: ComponenteModal

  constructor() {
    this.DetalleTrabajoAsignadoPage = markRaw(
      new ComponenteModal('Detalles del trabajo', DetalleTrabajoAsignadoPage)
    )

    this.EmergenciaPage = markRaw(
      new ComponenteModal('Seguimiento', EmergenciaPage)
    )
  }
}
