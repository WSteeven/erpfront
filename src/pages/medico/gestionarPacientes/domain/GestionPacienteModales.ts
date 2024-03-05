// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ResultadosExamenPage from '../modules/resultadosExamen/view/ResultadosExamenPage.vue'
import SolicitudExamenSolicitarPage from 'medico/gestionarPacientes/modules/solicitudExamen/view/SolicitudExamenSolicitarPage.vue'
import DiagnosticoRecetaPage from 'pages/medico/diagnosticoReceta/view/DiagnosticoRecetaPage.vue'
import EsquemaVacunacionPage from 'medico/gestionarPacientes/modules/esquemaVacunacion/view/EsquemaVacunacionPage.vue'

export class GestionPacienteModales {
  ResultadosExamenPage: ComponenteModal
  SolicitudExamenSolicitarPage: ComponenteModal
  DiagnosticoRecetaPage: ComponenteModal
  EsquemaVacunacionPage: ComponenteModal

  constructor() {
    this.ResultadosExamenPage = markRaw(new ComponenteModal('Resultados de examen', ResultadosExamenPage))
    this.SolicitudExamenSolicitarPage = markRaw(new ComponenteModal('Realizar solicitud de examenes médicos', SolicitudExamenSolicitarPage))
    this.DiagnosticoRecetaPage = markRaw(new ComponenteModal('Diagnóstico receta', DiagnosticoRecetaPage))
    this.EsquemaVacunacionPage = markRaw(new ComponenteModal('Esquema de vacunación', EsquemaVacunacionPage))
  }
}
