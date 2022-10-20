//Dependencias
import { configuracionColumnasActivosFijos } from "../domain/configuracionColumnasActivosFijos";
import { required } from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core"
import { defineComponent, ref } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { ActivoFijo } from "../domain/ActivoFijo";
import { useQuasar } from "quasar";
import { useNotificacionStore } from "stores/notificacion";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { DetalleProductoController } from "pages/bodega/detalles_productos/infraestructure/DetalleProductoController";
import { CondicionController } from "pages/administracion/condiciones/infraestructure/CondicionController";
import { SucursalController } from "pages/administracion/sucursales/infraestructure/SucursalController";
import { ActivoFijoController } from "../infraestructure/ActivoFijoController";

export default defineComponent({
    components: {TabLayout},
    setup(){
        const mixin = new ContenedorSimpleMixin(ActivoFijo, new ActivoFijoController())
        const {entidad: activo, disabled, accion, listadosAuxiliares} = mixin.useReferencias()
        const {setValidador, cargarVista, obtenerListados} = mixin.useComportamiento()

        const opciones_empleados = ref([])
        const opciones_sucursales = ref([])
        const opciones_condiciones = ref([])
        const opciones_detalles = ref([])
        cargarVista(()=>{
            obtenerListados({
                empleados: new EmpleadoController(),
                sucursales: new SucursalController(),
                condiciones: new CondicionController(),
                detalles: new DetalleProductoController(),

            })
        })

        //reglas de validacion
        const reglas = {
            fecha_desde: {required},
            accion: {required},
            lugar: {required},
            detalle_id: {required},
            empleado: {required},
            sucursal: {required},
            condicion: {required},
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$=useVuelidate(reglas, activo)
        setValidador(v$.value)

        opciones_condiciones.value = listadosAuxiliares.condiciones
        opciones_empleados.value = listadosAuxiliares.empleados
        opciones_sucursales.value = listadosAuxiliares.sucursales
        opciones_detalles.value = listadosAuxiliares.detalles
        const acciones = ['ASIGNACION','DEVOLUCION']
        return {
            mixin, activo, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasActivosFijos,
            //listado
            opciones_condiciones, opciones_empleados, opciones_sucursales, opciones_detalles, acciones,
            
        }
    }
})