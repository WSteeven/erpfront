// Dependencies
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';
import { markRaw } from 'vue';

//Pages
import CambiarClientePropietarioMaterialPage from '../view/CambiarClientePropietarioMaterialPage.vue';

export class MaterialEmpleadoModales {
    CambiarClientePropietarioMaterialPage: ComponenteModal

    constructor() {
        this.CambiarClientePropietarioMaterialPage = markRaw(new ComponenteModal('Cambiar Propietario', CambiarClientePropietarioMaterialPage))
    }
}