// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import MaterialOcupadoPage from 'pages/tareas/subtareas/modules/plantillaGenerica/modules/materialesOcupados/view/MaterialOcupadoPage.vue'
//aqui
export class ControlAvanceModales {
    MaterialOcupadoPage: ComponenteModal

    constructor() {
        this.MaterialOcupadoPage = markRaw(
            new ComponenteModal('CONSTRUCRED', MaterialOcupadoPage)
        )
    }
}
