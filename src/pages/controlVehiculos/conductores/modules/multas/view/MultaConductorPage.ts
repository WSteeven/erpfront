// Dependencies
import { defineComponent, reactive } from "vue";
import { required } from "shared/i18n-validators";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { MultaConductor } from "../domain/MultaConductor";
import { MultaConductorController } from "../infraestructure/MultaConductorController";
import { useAuthenticationStore } from "stores/authentication";
import { ConductorController } from "pages/controlVehiculos/conductores/infraestructure/ConductorController";
import useVuelidate from "@vuelidate/core";
import { configuracionColumnasMultasConductores } from "../domain/configuracionColumnasMultaConductor";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";


export default defineComponent({
    components: { TabLayout },
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(MultaConductor, new MultaConductorController())
        const { entidad: multa, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { onConsultado, onReestablecer, onGuardado } = mixin.useHooks()

        //variables
        const empleado: Empleado = reactive(new Empleado())
        const store = useAuthenticationStore()
        const statusLoading = new StatusEssentialLoading()

        cargarVista(async () => {
            obtenerListados({
                empleados: new ConductorController(),
            })
        })
        /**************************************************************
        * Hooks
        **************************************************************/
        onConsultado(() => {
            // obtenerProveedor(contacto.proveedor)
        })
        onReestablecer(() => {
            // proveedor.hydrate(new Proveedor())
        })
        onGuardado(() => {
            emit('cerrar-modal', false)
            emit('guardado', 'MultaConductorPage')
        })

        /**************************************************************
         * Validaciones
         **************************************************************/
        const reglas = {
            empleado: { required },
            fecha_infraccion: { required },
            total: { required },

        }
        const v$ = useVuelidate(reglas, multa)
        setValidador(v$.value)
        /*********************************
         * Funciones
        *********************************/
        async function obtenerEmpleado(empleadoId: number | null) {
            if (empleadoId != null) {
                statusLoading.activar()
                const { result } = await new EmpleadoController().consultar(empleadoId)
                console.log(result)
                empleado.hydrate(result)
                statusLoading.desactivar()
            }
        }


        /********************************
         * LISTADOS Y FILTROS
         ********************************/
        const {
            empleados, filtrarEmpleados, ordenarEmpleados,
        } = useFiltrosListadosSelects(listadosAuxiliares)

        empleados.value = listadosAuxiliares.empleados
        return {
            mixin, multa, disabled, v$, accion,
            configuracionColumnas: configuracionColumnasMultasConductores,


            //listados
            empleados, filtrarEmpleados, ordenarEmpleados,obtenerEmpleado,
            
        
        }
    },
})