// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import TipoTareaPage from 'pages/tareas/tiposTareas/view/TipoTareaPage.vue'
//aqui
export class ControlAvanceModales {
    TipoTareaPage: ComponenteModal

    constructor() {
        this.TipoTareaPage = markRaw(
            new ComponenteModal('CONSTRUCRED', TipoTareaPage)
        )
    }
}
