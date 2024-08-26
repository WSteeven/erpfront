// Dependencies
import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

// Paginas
import AgregarBancoPostulantePage from "../modules/bancoPostulantes/view/AgregarBancoPostulantePage.vue";
import CalificarCandidatoPage from "../modules/calificarCandidatos/view/CalificarCandidatoPage.vue";

export class PostulacionModales {
  BancoPostulantePage: ComponenteModal
  CalificarCandidatoPage: ComponenteModal

  constructor(){
    this.BancoPostulantePage = markRaw(new ComponenteModal('Agregar al banco de postulantes', AgregarBancoPostulantePage))
    this.CalificarCandidatoPage = markRaw(new ComponenteModal('Calificar candidato', CalificarCandidatoPage))
  }
}
