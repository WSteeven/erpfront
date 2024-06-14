//Dependencias
import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

//Paginas
import SeguroVehicularPage from "pages/controlVehiculos/seguros/view/SeguroVehicularPage.vue";

export class VehiculoModales {
    SeguroVehicularPage: ComponenteModal

    constructor() {
        this.SeguroVehicularPage = markRaw(new ComponenteModal('Seguro Vehicular', SeguroVehicularPage))
    }
}