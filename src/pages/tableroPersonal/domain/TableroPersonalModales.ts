// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'
import VisualizarEventoPage from '../modules/visualizarEvento/VisualizarEventoPage.vue'
// import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
// import { markRaw } from 'vue'

// Paginas

export class TableroPersonalModales {
     VisualizarEventoPage: ComponenteModal

    constructor() {
         this.VisualizarEventoPage = markRaw(
            new ComponenteModal('CONSTRUCRED', VisualizarEventoPage)
        )
    }
}
