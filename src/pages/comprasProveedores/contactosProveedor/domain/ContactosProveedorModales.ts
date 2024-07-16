//Dependencias

import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';
import { markRaw } from 'vue';

//Paginas
import ContactoProveedorLogPage from '../view/logs/ContactoProveedorLogPage.vue';

export class ContactosProveedorModales {
    ContactoProveedorLogPage: ComponenteModal

    constructor() {
        this.ContactoProveedorLogPage = markRaw(new ComponenteModal('Logs de cambios', ContactoProveedorLogPage))
    }
}