// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ResultadosExamenPage from '../modules/resultadosExamen/view/ResultadosExamenPage.vue'
import SolicitudExamenPage from 'medico/gestionarPacientes/modules/solicitudExamen/view/SolicitudExamenPage.vue'
import DiagnosticoRecetaPage from 'pages/medico/diagnosticoReceta/view/DiagnosticoRecetaPage.vue'
import EsquemaVacunacionPage from 'medico/gestionarPacientes/modules/esquemaVacunacion/view/EsquemaVacunacionPage.vue'

export class GestionPacienteModales {
  ResultadosExamenPage: ComponenteModal
  SolicitudExamenPage: ComponenteModal
  DiagnosticoRecetaPage: ComponenteModal
  EsquemaVacunacionPage: ComponenteModal

  constructor() {
    this.ResultadosExamenPage = markRaw(new ComponenteModal('Resultados de examen', ResultadosExamenPage))
    this.SolicitudExamenPage = markRaw(new ComponenteModal('Solicitud de examen', SolicitudExamenPage))
    this.DiagnosticoRecetaPage = markRaw(new ComponenteModal('Diagnóstico receta', DiagnosticoRecetaPage))
    this.EsquemaVacunacionPage = markRaw(new ComponenteModal('Esquema de vacunación', EsquemaVacunacionPage))
  }
}
