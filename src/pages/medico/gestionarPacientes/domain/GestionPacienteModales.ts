// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ResultadosExamenPage from '../modules/resultadosExamen/view/ResultadosExamenPage.vue'
import SolicitudExamenPage from 'medico/gestionarPacientes/modules/solicitudExamen/view/SolicitudExamenPage.vue'

export class GestionPacienteModales {
  ResultadosExamenPage: ComponenteModal
  SolicitudExamenPage: ComponenteModal

  constructor() {
    this.ResultadosExamenPage = markRaw(new ComponenteModal('Resultados de examen', ResultadosExamenPage))
    this.SolicitudExamenPage = markRaw(new ComponenteModal('Solicitud de examen', SolicitudExamenPage))
  }
}
