// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ResultadosExamenPage from '../modules/resultadosExamen/view/ResultadosExamenPage.vue'
import SolicitudExamenSolicitarPage from 'medico/gestionarPacientes/modules/solicitudExamen/view/SolicitudExamenSolicitarPage.vue'
import DiagnosticoRecetaPage from 'pages/medico/diagnosticoReceta/view/DiagnosticoRecetaPage.vue'
import EsquemaVacunacionPage from 'medico/gestionarPacientes/modules/esquemaVacunacion/view/EsquemaVacunacionPage.vue'
import FichaAptitudPage from 'medico/gestionarPacientes/modules/fichaAptitud/view/FichaAptitudPage.vue'
import FichaPeriodicaPreocupacionalPage from 'medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/view/FichaPeriodicaPreocupacionalPage.vue'
import FichaRetiroPage from 'medico/gestionarPacientes/modules/fichaRetiro/view/FichaRetiroPage.vue'
import SubirResultadosExamenesPage from 'medico/gestionarPacientes/modules/solicitudExamen/modules/subirResultados/view/SubirResultadosExamenesPage.vue'

export class GestionPacienteModales {
  ResultadosExamenPage: ComponenteModal
  SolicitudExamenSolicitarPage: ComponenteModal
  DiagnosticoRecetaPage: ComponenteModal
  EsquemaVacunacionPage: ComponenteModal
  FichaAptitudPage: ComponenteModal
  FichaPeriodicaPreocupacionalPage: ComponenteModal
  FichaRetiroPage: ComponenteModal
  SubirResultadosExamenesPage: ComponenteModal

  constructor() {
    this.ResultadosExamenPage = markRaw(new ComponenteModal('Resultados de examen', ResultadosExamenPage))
    this.SolicitudExamenSolicitarPage = markRaw(new ComponenteModal('Realizar solicitud de examenes médicos', SolicitudExamenSolicitarPage))
    this.DiagnosticoRecetaPage = markRaw(new ComponenteModal('Diagnóstico receta', DiagnosticoRecetaPage))
    this.EsquemaVacunacionPage = markRaw(new ComponenteModal('Esquema de vacunación', EsquemaVacunacionPage))
    this.FichaAptitudPage = markRaw(new ComponenteModal('Ficha de Aptitud', FichaAptitudPage))
    this.FichaPeriodicaPreocupacionalPage = markRaw(new ComponenteModal('Ficha períodica', FichaPeriodicaPreocupacionalPage))
    this.FichaRetiroPage = markRaw(new ComponenteModal('Ficha de retiro', FichaRetiroPage))
    this.SubirResultadosExamenesPage = markRaw(new ComponenteModal('Subir resultados de examenes', SubirResultadosExamenesPage))
  }
}
