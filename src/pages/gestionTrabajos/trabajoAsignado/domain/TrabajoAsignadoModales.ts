// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import SubtareaAsignadaPage from '../modules/subtareasAsignadas/view/SubtareaAsignadaPage'
// import RecopilacionInformacion from 'pages/tareas/trabajoAsignado/modules/recopilacionInformacion/view/SeleccionFormularioPage.vue'
import ControlTendidoPage from 'pages/gestionTrabajos/tendidos/controlTendidos/view/ControlTendidoPage'
import SeleccionFormularioPage from 'pages/gestionTrabajos/trabajoAsignado/modules/seleccionFormulario/view/SeleccionFormularioPage.vue'
import EmergenciaPage from 'pages/gestionTrabajos/formulariosTrabajos/emergencias/view/EmergenciaPage'

export class TrabajoAsignadoModales {
  SubtareaAsignadaPage: ComponenteModal
  // RecopilacionInformacion: ComponenteModal
  ControlTendido: ComponenteModal
  SeleccionFormularioPage: ComponenteModal
  EmergenciaPage: ComponenteModal

  constructor() {
    this.SubtareaAsignadaPage = markRaw(
      new ComponenteModal('Detalles del trabajo', SubtareaAsignadaPage)
    )
    /*this.RecopilacionInformacion = markRaw(
        new ComponenteModal('CONSTRUCRED', RecopilacionInformacion)
    )*/
    this.ControlTendido = markRaw(
      new ComponenteModal('CONSTRUCRED', ControlTendidoPage)
    )

    this.SeleccionFormularioPage = markRaw(
      new ComponenteModal('Ingreso de información', SeleccionFormularioPage)
    )

    this.EmergenciaPage = markRaw(
      new ComponenteModal('Gestionar avances', EmergenciaPage)
    )
  }
}
