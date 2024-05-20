// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ResultadosExamenPage from '../modules/resultadosExamen/view/ResultadosExamenPage.vue'
import SolicitudExamenSolicitarPage from 'medico/gestionarPacientes/modules/solicitudExamen/view/SolicitudExamenSolicitarPage.vue'
import DiagnosticoRecetaPage from 'pages/medico/diagnosticoReceta/view/DiagnosticoRecetaPage.vue'
import EsquemaVacunacionPage from 'medico/gestionarPacientes/modules/esquemaVacunacion/view/EsquemaVacunacionPage.vue'
import FichaAptitudPage from 'medico/gestionarPacientes/modules/fichaAptitud/view/FichaAptitudPage.vue'
import FichaPreocupacionalPage from 'medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/view/FichaPreocupacionalPage.vue'
import FichaPeriodicaPage from 'medico/gestionarPacientes/modules/fichaPeriodica/view/FichaPeriodicaPage.vue'
import FichaReintegroPage from 'medico/gestionarPacientes/modules/fichaReintegro/view/FichaReintegroPage.vue'
import FichaRetiroPage from 'medico/gestionarPacientes/modules/fichaRetiro/view/FichaRetiroPage.vue'
import SubirResultadosExamenesPage from 'medico/gestionarPacientes/modules/solicitudExamen/modules/subirResultados/view/SubirResultadosExamenesPage.vue'

export class GestionPacienteModales {
  ResultadosExamenPage: ComponenteModal
  SolicitudExamenSolicitarPage: ComponenteModal
  DiagnosticoRecetaPage: ComponenteModal
  EsquemaVacunacionPage: ComponenteModal
  FichaAptitudPage: ComponenteModal
  FichaPreocupacionalPage: ComponenteModal
  FichaRetiroPage: ComponenteModal
  SubirResultadosExamenesPage: ComponenteModal
  FichaPeriodicaPage: ComponenteModal
  FichaReintegroPage: ComponenteModal

  constructor() {
    this.ResultadosExamenPage = markRaw(new ComponenteModal('Resultados de examen', ResultadosExamenPage))
    this.SolicitudExamenSolicitarPage = markRaw(new ComponenteModal('Realizar solicitud de examenes médicos', SolicitudExamenSolicitarPage))
    this.DiagnosticoRecetaPage = markRaw(new ComponenteModal('Diagnóstico receta', DiagnosticoRecetaPage))
    this.EsquemaVacunacionPage = markRaw(new ComponenteModal('Esquema de vacunación', EsquemaVacunacionPage))
    this.FichaAptitudPage = markRaw(new ComponenteModal('Ficha de Aptitud', FichaAptitudPage))
    this.FichaPreocupacionalPage = markRaw(new ComponenteModal('Ficha preocupacional', FichaPreocupacionalPage))
    this.FichaPeriodicaPage = markRaw(new ComponenteModal('Ficha periódica', FichaPeriodicaPage))
    this.FichaReintegroPage = markRaw(new ComponenteModal('Ficha reintegro', FichaReintegroPage))
    this.FichaRetiroPage = markRaw(new ComponenteModal('Ficha de retiro', FichaRetiroPage))
    this.SubirResultadosExamenesPage = markRaw(new ComponenteModal('Subir resultados de examenes', SubirResultadosExamenesPage))
  }
}
