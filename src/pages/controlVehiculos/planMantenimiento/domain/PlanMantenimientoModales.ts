// Dependencias
import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";
// Paginas
import ServicioPage from "pages/controlVehiculos/servicios/view/ServicioPage.vue";


export class PlanMantenimientoModales {
    ServicioPage: ComponenteModal

    constructor() {
        this.ServicioPage = markRaw(new ComponenteModal('Nuevo Servicio', ServicioPage))
    }
}