import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { useEmpleadoStore } from "stores/empleado";
import { defineComponent, onBeforeUnmount, reactive } from "vue";
import { Empleado } from "../domain/Empleado";
import { EmpleadoController } from "../infraestructure/EmpleadoController";

export default defineComponent({
    setup() {

        /*********
         * Stores
         *********/
        const empleadoStore = useEmpleadoStore()
        
        
        return {
            empleado:empleadoStore.empleado,
        }
    }
})