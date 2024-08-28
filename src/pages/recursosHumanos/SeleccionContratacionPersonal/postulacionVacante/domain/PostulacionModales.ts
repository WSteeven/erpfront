// Dependencies
import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

// Paginas
import AgregarBancoPostulantePage from "../modules/bancoPostulantes/view/AgregarBancoPostulantePage.vue";
import CalificarCandidatoPage from "../modules/calificarCandidatos/view/CalificarCandidatoPage.vue";
import EntrevistarPage from "../modules/entrevistas/view/EntrevistarPage.vue";


export class PostulacionModales {
  BancoPostulantePage: ComponenteModal
  CalificarCandidatoPage: ComponenteModal
  EntrevistarPage: ComponenteModal

  constructor(){
    this.BancoPostulantePage = markRaw(new ComponenteModal('Agregar al banco de postulantes', AgregarBancoPostulantePage))
    this.CalificarCandidatoPage = markRaw(new ComponenteModal('Calificar candidato', CalificarCandidatoPage))
    this.EntrevistarPage = markRaw(new ComponenteModal('Establecer fecha de entrevista', EntrevistarPage))
  }
}
