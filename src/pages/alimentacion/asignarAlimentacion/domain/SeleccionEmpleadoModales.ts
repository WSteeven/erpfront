import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";
import SeleccionEmpleadoPage from "../modules/selecionEmpleado/views/SeleccionEmpleadoPage.vue";

//paginas
export class SeleccionEmpleadoModales{
  SeleccionEmpleadoPage: ComponenteModal

    constructor(){
        this.SeleccionEmpleadoPage = markRaw(new ComponenteModal('Seleccionar Empleados', SeleccionEmpleadoPage))
    }
}
