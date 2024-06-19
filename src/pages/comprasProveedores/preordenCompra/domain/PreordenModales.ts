import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';
import { markRaw } from 'vue';

//paginas
import ConsolidarPreordenPage from '../modules/consolidarPreordenes/views/ConsolidarPreordenPage.vue'
export class PreordenModales {
    ConsolidarPreordenPage: ComponenteModal

    constructor() {
        this.ConsolidarPreordenPage = markRaw(new ComponenteModal('Consolidar Preordenes de Compras', ConsolidarPreordenPage))
    }
}