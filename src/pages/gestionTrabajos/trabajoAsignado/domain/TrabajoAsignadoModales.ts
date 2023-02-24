// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
// import RecopilacionInformacion from 'pages/tareas/trabajoAsignado/modules/recopilacionInformacion/view/SeleccionFormularioPage.vue'
import DetalleTrabajoAsignadoPage from 'gestionTrabajos/trabajoAsignado/modules/detalleTrabajosAsignados/view/DetalleTrabajoAsignadoPage.vue'
import ControlTendido from 'formulariosTrabajos/tendidos/controlTendidos/view/ControlTendidoPage.vue'
import EmergenciaPage from 'formulariosTrabajos/emergencias/view/EmergenciaPage.vue'
//import SeleccionFormularioPage from 'pages/tareas/trabajoAsignado/modules/seleccionFormulario/view/SeleccionFormularioPage.vue'
export class TrabajoAsignadoModales {
  DetalleTrabajoAsignadoPage: ComponenteModal
  // RecopilacionInformacion: ComponenteModal
  ControlTendido: ComponenteModal
  // SeleccionFormularioPage: ComponenteModal
  EmergenciaPage: ComponenteModal

  constructor() {
    this.DetalleTrabajoAsignadoPage = markRaw(
      new ComponenteModal('Detalles del trabajo', DetalleTrabajoAsignadoPage)
    )
    /*this.RecopilacionInformacion = markRaw(
        new ComponenteModal('CONSTRUCRED', RecopilacionInformacion)
    )*/
    this.ControlTendido = markRaw(
      new ComponenteModal('CONSTRUCRED', ControlTendido)
    )

    /*this.SeleccionFormularioPage = markRaw(
      new ComponenteModal('Ingreso de información', SeleccionFormularioPage)
    ) */

    this.EmergenciaPage = markRaw(
      new ComponenteModal('Gestionar avances', EmergenciaPage)
    )
  }
}
