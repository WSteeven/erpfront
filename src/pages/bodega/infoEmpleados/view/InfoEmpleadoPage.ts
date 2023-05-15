//Dependencias
import { configuracionColumnasInfoEmpleados } from "../domain/configuracionColumnasInfoEmpleados"

//Componentes
import EssentialTable from "components/tables/view/EssentialTable"
import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado"
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController"
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin"
import { defineComponent } from "vue"

export default defineComponent({
    components:{EssentialTable},
    setup(){
        const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController())
        const {entidad: empleado, disabled, listado}= mixin.useReferencias()
        const {listar}=mixin.useComportamiento()

        listar()
        return {
            mixin, empleado, disabled, listado,
            configuracionColumnas: configuracionColumnasInfoEmpleados
        }
    }
})
