//Dependencies
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';
import { markRaw } from 'vue';

// Pages
import VisualizarPrefacturaPage from '../view/VisualizarPrefacturaPage.vue';


export class PrefacturaModales {
    VisualizarPrefactura: ComponenteModal

    constructor() {
        this.VisualizarPrefactura = markRaw(new ComponenteModal('Prefactura', VisualizarPrefacturaPage))
    }
}