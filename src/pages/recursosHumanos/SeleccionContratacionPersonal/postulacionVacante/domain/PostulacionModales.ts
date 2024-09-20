// Dependencies
import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

// Paginas
import AgregarBancoPostulantePage from "../modules/bancoPostulantes/view/AgregarBancoPostulantePage.vue";
import CalificarCandidatoPage from "../modules/calificarCandidatos/view/CalificarCandidatoPage.vue";
import EntrevistarPage from "../modules/entrevistas/view/EntrevistarPage.vue";
import AgendarCitaMedicaPage from "../modules/citasMedicas/view/AgendarCitaMedicaPage.vue";
import ActualizarResultadosCitaMedicaPage from "../modules/citasMedicas/view/ActualizarResultadosCitaMedicaPage.vue";


export class PostulacionModales {
  AgregarBancoPostulantePage: ComponenteModal
  CalificarCandidatoPage: ComponenteModal
  EntrevistarPage: ComponenteModal
  AgendarCitaMedicaPage: ComponenteModal
  ActualizarResultadosCitaMedicaPage: ComponenteModal

  constructor() {
    this.AgregarBancoPostulantePage = markRaw(new ComponenteModal('Agregar al banco de postulantes', AgregarBancoPostulantePage))
    this.CalificarCandidatoPage = markRaw(new ComponenteModal('Calificar candidato', CalificarCandidatoPage))
    this.EntrevistarPage = markRaw(new ComponenteModal('Establecer fecha de entrevista', EntrevistarPage))
    this.AgendarCitaMedicaPage = markRaw(new ComponenteModal('Agendamiento de cita para exámenes médicos del postulante', AgendarCitaMedicaPage))
    this.ActualizarResultadosCitaMedicaPage = markRaw(new ComponenteModal('Resultados de exámenes médicos del postulante', ActualizarResultadosCitaMedicaPage))
  }
}
