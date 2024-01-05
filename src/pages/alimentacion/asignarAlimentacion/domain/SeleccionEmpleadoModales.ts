import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";
import SeleccionEmpleadoPage from "../modules/selecionEmpleado/views/SeleccionEmpleadoPage.vue";
import AlimentacionPage from "../modules/alimentacion/views/AlimentacionPage.vue";

//paginas
export class SeleccionEmpleadoModales{
  SeleccionEmpleadoPage: ComponenteModal
  AlimentacionPage: ComponenteModal
    constructor(){
        this.SeleccionEmpleadoPage = markRaw(new ComponenteModal('Seleccionar Empleados', SeleccionEmpleadoPage))
        this.AlimentacionPage = markRaw(new ComponenteModal('Alimentacion', AlimentacionPage))
    }
}
