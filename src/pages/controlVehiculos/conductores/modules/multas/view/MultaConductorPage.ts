// Dependencies
import { defineComponent, reactive, ref } from "vue";
import { required, requiredIf } from "shared/i18n-validators";

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
import { maskFecha } from "config/utils";
import { VehiculoController } from "pages/controlVehiculos/vehiculos/infraestructure/VehiculoController";
import { LocalStorage } from "quasar";
import { useConductorStore } from "stores/vehiculos/conductor";


export default defineComponent({
    components: { TabLayout },
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(MultaConductor, new MultaConductorController())
        const { entidad: multa, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { onConsultado, onReestablecer, onGuardado } = mixin.useHooks()

        //stores
        const store = useAuthenticationStore()
        const cargando = new StatusEssentialLoading()
        const conductorStore = useConductorStore()
        //variables
        const mostrarListado = ref(true)
        const soloLectura = ref(false)
        const empleado: Empleado = reactive(new Empleado())

        cargarVista(async () => {
            if (conductorStore.conductor.info_empleado != null) {
                empleado.hydrate(conductorStore.conductor.info_empleado)
                multa.empleado = empleado.id
                soloLectura.value = true
            } else {
                soloLectura.value = false
                multa.empleado = null
                empleado.hydrate(new Empleado())
            }

            await obtenerListados({
                empleados: new ConductorController(),
                vehiculos: {
                    controller: new VehiculoController(),
                    params: {
                        campos: 'id,placa,modelo_id',
                    },
                },
            })
            listadosAuxiliares.cantones = JSON.parse(LocalStorage.getItem('cantones')!.toString())

        })
        /**************************************************************
        * Hooks
        **************************************************************/
        onConsultado(() => {
            // obtenerProveedor(contacto.proveedor)
        })
        onReestablecer(() => {
            empleado.hydrate(new Empleado())
            soloLectura.value = false
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
            fecha_pago: { requiredIf: requiredIf(() => multa.estado) },
            total: { required },

        }
        const v$ = useVuelidate(reglas, multa)
        setValidador(v$.value)
        /*********************************
         * Funciones
        *********************************/
        async function obtenerEmpleado(empleadoId: number | null) {
            if (empleadoId != null) {
                cargando.activar()
                const { result } = await new EmpleadoController().consultar(empleadoId)
                console.log(result)
                empleado.hydrate(result)
                cargando.desactivar()
            }
        }


        /********************************
         * LISTADOS Y FILTROS
         ********************************/
        const {
            empleados, filtrarEmpleados, ordenarEmpleados,
            vehiculos, filtrarVehiculos,
            cantones,
        } = useFiltrosListadosSelects(listadosAuxiliares)

        cantones.value = listadosAuxiliares.cantones
        empleados.value = listadosAuxiliares.empleados
        vehiculos.value = listadosAuxiliares.vehiculos
        return {
            mixin, multa, disabled, v$, accion,
            configuracionColumnas: configuracionColumnasMultasConductores,
            empleado, maskFecha,
            mostrarListado,
            soloLectura,

            //listados
            empleados, filtrarEmpleados, ordenarEmpleados, obtenerEmpleado,
            cantones,
            vehiculos, filtrarVehiculos,


        }
    },
})