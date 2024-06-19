// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';
import { markRaw } from 'vue';

//Paginas
import EtapaPage from '../modules/etapas/view/EtapaPage.vue'
import EditarEtapaPage from '../modules/etapas/view/EditarEtapaPage.vue'

export class ProyectoModales {
  EtapaPage: ComponenteModal
  EditarEtapaPage: ComponenteModal

  constructor() {
    this.EtapaPage = markRaw(new ComponenteModal('Etapas de Proyecto', EtapaPage))
    this.EditarEtapaPage = markRaw(new ComponenteModal('Etapas de Proyecto', EditarEtapaPage))
  }
}
