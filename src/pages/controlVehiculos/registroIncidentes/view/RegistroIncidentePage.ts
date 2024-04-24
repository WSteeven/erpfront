//Dependencias
import { configuracionColumnasRegistroIncidente } from "../domain/configuracionColumnasRegistroIncidente"
import { defineComponent } from "vue"

// Components
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue"
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin"
import { RegistroIncidente } from "../domain/RegistroIncidente"
import { RegistroIncidenteController } from "../infraestructure/RegistroIncidenteController"
import { useNotificaciones } from "shared/notificaciones"
import { useAuthenticationStore } from "stores/authentication"
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading"
import { VehiculoController } from "pages/controlVehiculos/vehiculos/infraestructure/VehiculoController"
import { required } from "shared/i18n-validators"
import useVuelidate from "@vuelidate/core"
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales"
import { maskFecha } from "config/utils"
import { subtiposIncidentes, tiposIncidentes } from "config/vehiculos.utils"


//Logica y controladores


export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(RegistroIncidente, new RegistroIncidenteController())
        const { entidad: registro, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { onReestablecer, onConsultado, onBeforeModificar } = mixin.useHooks()
        const { confirmar, prompt, } = useNotificaciones()

        /****************************************
         * Stores
         ****************************************/
        const store = useAuthenticationStore()
        const cargando = new StatusEssentialLoading()

        const { vehiculos, filtrarVehiculos,
            empleados, filtrarEmpleados,
        } = useFiltrosListadosSelects(listadosAuxiliares)

        cargarVista(async () => {
            await obtenerListados({
                vehiculos: new VehiculoController(),
                empleados: { controller: new VehiculoController(), params: { estado: 1 } },
            })
            vehiculos.value = listadosAuxiliares.vehiculos
            empleados.value = listadosAuxiliares.empleados

        })

        const reglas = {
            vehiculo: { required },
            fecha: { required },
        }

        const v$ = useVuelidate(reglas, registro)
        setValidador(v$.value)


        /****************************************
         * Funciones
         ****************************************/
        function filtrarSubtipos() {

        }

        return {
            mixin, registro, v$, accion, disabled,
            configuracionColumnas: configuracionColumnasRegistroIncidente,
            maskFecha,

            //listados
            vehiculos, filtrarVehiculos,
            empleados, filtrarEmpleados,
            tiposIncidentes, subtiposIncidentes,


            //funciones
            filtrarSubtipos,


        }
    }
})