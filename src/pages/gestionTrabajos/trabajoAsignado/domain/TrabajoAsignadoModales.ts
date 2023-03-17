// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import DetalleTrabajoAsignadoPage from 'gestionTrabajos/trabajoAsignado/modules/detalleTrabajosAsignados/view/DetalleTrabajoAsignadoPage.vue'
import ControlTendidoPage from 'formulariosTrabajos/tendidos/controlTendidos/view/ControlTendidoPage.vue'
import DesmontajePage from 'formulariosTrabajos/tendidos/controlDesmontaje/view/DesmontajePage.vue'
import EmergenciaPage from 'formulariosTrabajos/emergencias/view/EmergenciaPage.vue'
import AvanceGenericoPage from 'gestionTrabajos/formulariosTrabajos/avanceGenerico/view/AvanceGenericoPage.vue'
// import RecopilacionInformacion from 'pages/tareas/trabajoAsignado/modules/recopilacionInformacion/view/SeleccionFormularioPage.vue'

export class TrabajoAsignadoModales {
  DetalleTrabajoAsignadoPage: ComponenteModal
  ControlTendido: ComponenteModal
  EmergenciaPage: ComponenteModal
  DesmontajePage: ComponenteModal
  AvanceGenericoPage: ComponenteModal

  constructor() {
    this.DetalleTrabajoAsignadoPage = markRaw(
      new ComponenteModal('Detalles del trabajo', DetalleTrabajoAsignadoPage)
    )

    this.ControlTendido = markRaw(
      new ComponenteModal('Control de tendidos', ControlTendidoPage)
    )

    this.EmergenciaPage = markRaw(
      new ComponenteModal('Emergencias', EmergenciaPage)
    )

    this.DesmontajePage = markRaw(
      new ComponenteModal('Desmontajes', DesmontajePage)
    )

    this.AvanceGenericoPage = markRaw(
      new ComponenteModal('Control de avances', AvanceGenericoPage)
    )
  }
}
