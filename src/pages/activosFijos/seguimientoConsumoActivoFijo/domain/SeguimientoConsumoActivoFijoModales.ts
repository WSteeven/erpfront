// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue';

import AgregarSeguimientoConsumoActivoFijoPage from 'activosFijos/seguimientoConsumoActivoFijo/modules/view/AgregarSeguimientoConsumoActivoFijoPage.vue'

export class SeguimientoConsumoActivoFijoModales {
    AgregarSeguimientoConsumoActivoFijoPage: ComponenteModal

    constructor() {
        this.AgregarSeguimientoConsumoActivoFijoPage = markRaw(new ComponenteModal('Agregar seguimiento consumo activo fijo', AgregarSeguimientoConsumoActivoFijoPage))
    }
}