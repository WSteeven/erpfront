// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import DetalleTrabajoAsignadoPage from 'gestionTrabajos/trabajoAsignado/modules/detalleTrabajosAsignados/view/DetalleTrabajoAsignadoPage.vue'
import ControlTendidoPage from 'formulariosTrabajos/tendidos/controlTendidos/view/ControlTendidoPage.vue'
import EmergenciaPage from 'formulariosTrabajos/emergencias/view/EmergenciaPage.vue'
// import RecopilacionInformacion from 'pages/tareas/trabajoAsignado/modules/recopilacionInformacion/view/SeleccionFormularioPage.vue'
// import SeleccionFormularioPage from 'pages/tareas/trabajoAsignado/modules/seleccionFormulario/view/SeleccionFormularioPage.vue'

export class TrabajoAsignadoModales {
  DetalleTrabajoAsignadoPage: ComponenteModal
  ControlTendido: ComponenteModal
  EmergenciaPage: ComponenteModal

  constructor() {
    this.DetalleTrabajoAsignadoPage = markRaw(
      new ComponenteModal('Detalles del trabajo', DetalleTrabajoAsignadoPage)
    )

    this.ControlTendido = markRaw(
      new ComponenteModal('CONSTRUCRED', ControlTendidoPage)
    )

    this.EmergenciaPage = markRaw(
      new ComponenteModal('Gestionar avances', EmergenciaPage)
    )
  }
}
