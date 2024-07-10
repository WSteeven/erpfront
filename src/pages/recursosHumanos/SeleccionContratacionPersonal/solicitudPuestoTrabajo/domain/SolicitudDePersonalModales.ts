import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

// Paginas
import CrearCargoPage from "pages/recursosHumanos/cargos/view/CrearCargoPage.vue";

export class SolicitudPuestoEmpleoModales {
    CargoPage: ComponenteModal

    constructor() {
        this.CargoPage = markRaw(new ComponenteModal('Nuevo Cargo', CrearCargoPage))
    }
}