// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import SubtareaAsignadaPage from 'pages/tareas/trabajoAsignado/modules/subtareasAsignadas/view/SubtareaAsignadaPage.vue'
// import RecopilacionInformacion from 'pages/tareas/trabajoAsignado/modules/recopilacionInformacion/view/SeleccionFormularioPage.vue'
import ControlTendido from 'tareas/tendidos/controlTendidos/view/ControlTendidoPage.vue'
import SeleccionFormularioPage from 'pages/tareas/trabajoAsignado/modules/seleccionFormulario/view/SeleccionFormularioPage.vue'
export class TrabajoAsignadoModales {
  SubtareaAsignadaPage: ComponenteModal
  // RecopilacionInformacion: ComponenteModal
  ControlTendido: ComponenteModal
  SeleccionFormularioPage: ComponenteModal

  constructor() {
    this.SubtareaAsignadaPage = markRaw(
      new ComponenteModal('Detalles del trabajo', SubtareaAsignadaPage)
    )
    /*this.RecopilacionInformacion = markRaw(
        new ComponenteModal('CONSTRUCRED', RecopilacionInformacion)
    )*/
    this.ControlTendido = markRaw(
      new ComponenteModal('CONSTRUCRED', ControlTendido)
    )

    this.SeleccionFormularioPage = markRaw(
      new ComponenteModal('Ingreso de información', SeleccionFormularioPage)
    )
  }
}
