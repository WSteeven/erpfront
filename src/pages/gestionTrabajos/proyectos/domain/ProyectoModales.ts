// Dependencias
import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

//Paginas
import EtapaPage from '../modules/etapas/view/EtapaPage.vue'

export class ProyectoModales {
  EtapaPage: ComponenteModal

  constructor(){
    this.EtapaPage = markRaw(new ComponenteModal('Etapas de Proyecto', EtapaPage))
  }
}
