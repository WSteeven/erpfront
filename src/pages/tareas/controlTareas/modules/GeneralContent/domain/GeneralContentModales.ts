// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ClienteFinalPage from 'tareas/clientesFinales/view/ClienteFinalPage.vue'

export class GeneralContentModales {
    ClienteFinalPage: ComponenteModal

    constructor() {
        this.ClienteFinalPage = markRaw(
            new ComponenteModal('Clientes finales', ClienteFinalPage)
        )
    }
}
