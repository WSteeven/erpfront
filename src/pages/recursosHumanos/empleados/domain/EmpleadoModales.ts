// Dependencias
import { ComponenteModal } from "components/modales/domain/ComponenteModal.domain";
import { markRaw } from "vue";

//Paginas
import EmpleadoPage from "../view/EmpleadoPage.vue";
import EmpleadoInfoPage from "../view/EmpleadoInfoPage.vue";

export class EmpleadoModales{
    EmpleadoPage: ComponenteModal
    EmpleadoInfoPage: ComponenteModal

    constructor(){
        this.EmpleadoPage = markRaw(new ComponenteModal('Empleado', EmpleadoPage))
        this.EmpleadoInfoPage = markRaw(new ComponenteModal('Información de empleado', EmpleadoInfoPage))
    }
}