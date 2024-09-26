import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';
import { markRaw } from 'vue';

//Componentes
import VisualizarEventoPage from '../modules/visualizarEvento/view/VisualizarEventoPage.vue';

export class IntranetModales {
    VisualizarEventoPage: ComponenteModal

    constructor() {
        this.VisualizarEventoPage = markRaw(new ComponenteModal('CONSTRUCRED', VisualizarEventoPage))
    }
}
