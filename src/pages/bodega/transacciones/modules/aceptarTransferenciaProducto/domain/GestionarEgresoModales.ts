//Dependencias

import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain';
import { markRaw } from 'vue';

//Paginas
import VisualizarEgresoPage  from 'pages/bodega/transacciones/modules/transaccionEgreso/VisualizarEgresoPage.vue'

export class GestionarEgresoModales{
    VisualizarEgresoPage: ComponenteModal

    constructor(){
        this.VisualizarEgresoPage = markRaw(new ComponenteModal('Egreso de bodega', VisualizarEgresoPage))
    }
}