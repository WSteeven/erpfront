// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import ContactoPage from 'pages/tareas/contactos/view/ContactoPage.vue'

export class TareaModales {
    ContactoPage: ComponenteModal

    constructor() {
        this.ContactoPage = markRaw(
            new ComponenteModal('CONSTRUCRED', ContactoPage)
        )
    }
}
