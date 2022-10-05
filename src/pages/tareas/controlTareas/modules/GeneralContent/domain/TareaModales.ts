// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import TipoTareaPage from 'pages/tareas/tiposTareas/view/TipoTareaPage.vue'

export class TareaModales {
    ContactoPage: ComponenteModal

    constructor() {
        this.ContactoPage = markRaw(
            new ComponenteModal('CONSTRUCRED', TipoTareaPage)
        )
    }
}
