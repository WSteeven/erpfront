import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";
import SeleccionEmpleadoPage from "../modules/selecionEmpleado/views/SeleccionEmpleadoPage.vue";
import DetalleAlimentacionPage from "../modules/detalleAlimentacion/views/DetalleAlimentacionPage.vue";

//paginas
export class SeleccionEmpleadoModales{
  SeleccionEmpleadoPage: ComponenteModal
  DetalleAlimentacionPage: ComponenteModal
    constructor(){
        this.SeleccionEmpleadoPage = markRaw(new ComponenteModal('Seleccionar Empleados', SeleccionEmpleadoPage))
        this.DetalleAlimentacionPage = markRaw(new ComponenteModal('Detalle Alimentacion', DetalleAlimentacionPage))
    }
}
