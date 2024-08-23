// Dependencies
import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

// Paginas
import AgregarBancoPostulantePage from "../modules/bancoPostulantes/view/AgregarBancoPostulantePage.vue";

export class PostulacionModales {
  BancoPostulantePage: ComponenteModal

  constructor(){
    this.BancoPostulantePage = markRaw(new ComponenteModal('Agregar al banco de postulantes', AgregarBancoPostulantePage))
  }
}
