import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

//paginas
import VisualizarEgresoPage from '../VisualizarEgresoPage.vue'
import ModificarEgresoPage from '../view/ModificarEgresoPage.vue'

export class TransaccionEgresoModales {
    VisualizarEgresoPage: ComponenteModal
    ModificarEgresoPage: ComponenteModal

    constructor() {
        this.VisualizarEgresoPage = markRaw(new ComponenteModal('Egresos de bodega', VisualizarEgresoPage))
        this.ModificarEgresoPage = markRaw(new ComponenteModal('Modificar Egreso', ModificarEgresoPage))
    }
}
