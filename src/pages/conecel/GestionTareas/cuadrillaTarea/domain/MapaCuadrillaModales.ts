import {ComponenteModal} from 'components/modales/domain/ComponenteModal.domain';
import {markRaw} from 'vue';

import SeleccionarTareaSubtareaModalPage from '../modules/crearSubtarea/SeleccionarTareaSubtareaModalPage.vue';

export class MapaCuadrillaModales{
    SeleccionarTareaSubtareaModalPage: ComponenteModal

    constructor() {
        this.SeleccionarTareaSubtareaModalPage = markRaw(new ComponenteModal('Crear subtarea', SeleccionarTareaSubtareaModalPage))
    }
}