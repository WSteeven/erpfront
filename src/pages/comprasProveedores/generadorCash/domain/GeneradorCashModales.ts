// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import BeneficiarioPage from 'comprasProveedores/generadorCash/modules/Beneficiario/view/BeneficiarioPage.vue'

export class GeneradorCashModales {
    BeneficiarioPage: ComponenteModal

    constructor() {
        this.BeneficiarioPage = markRaw(
            new ComponenteModal('Beneficiario', BeneficiarioPage)
        )
    }
}
