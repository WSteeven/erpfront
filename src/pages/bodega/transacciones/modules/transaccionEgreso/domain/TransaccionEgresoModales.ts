import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

//paginas
import VisualizarEgresoPage from '../VisualizarEgresoPage.vue'

export class TransaccionEgresoModales {
    VisualizarEgresoPage: ComponenteModal

    constructor() {
        this.VisualizarEgresoPage = markRaw(new ComponenteModal('Egresos de bodega', VisualizarEgresoPage))
    }
}
