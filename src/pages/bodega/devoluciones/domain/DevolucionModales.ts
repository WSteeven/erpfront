import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

//paginas
import ImprimirDevolucionPage from '../view/ImprimirDevolucionPage.vue'

export class DevolucionModales {
    ImprimirDevolucionPage: ComponenteModal

    constructor() {
        this.ImprimirDevolucionPage = markRaw(
            new ComponenteModal('CONSTRUCRED', ImprimirDevolucionPage)
        )
    }
}