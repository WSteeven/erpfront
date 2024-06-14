//Dependencias
import { configuracionColumnasRegistroIncidente } from "../domain/configuracionColumnasRegistroIncidente"
import { subtiposIncidentes, tiposIncidentes } from "config/vehiculos.utils"
import { acciones, maskFecha } from "config/utils"
import { required } from "shared/i18n-validators"
import { defineComponent, ref } from "vue"
import { ordenarLista } from "shared/utils"
import useVuelidate from "@vuelidate/core"

// Components
import GestorArchivos from "components/gestorArchivos/GestorArchivos.vue"
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue"

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin"
import { RegistroIncidente } from "../domain/RegistroIncidente"
import { RegistroIncidenteController } from "../infraestructure/RegistroIncidenteController"
import { useNotificaciones } from "shared/notificaciones"
import { useAuthenticationStore } from "stores/authentication"
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading"
import { VehiculoController } from "pages/controlVehiculos/vehiculos/infraestructure/VehiculoController"
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales"
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController"


export default defineComponent({
    components: { TabLayout, GestorArchivos },
    setup() {
        const mixin = new ContenedorSimpleMixin(RegistroIncidente, new RegistroIncidenteController())
        const { entidad: registro, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { onReestablecer, onConsultado, onModificado, onGuardado } = mixin.useHooks()
        const { confirmar, prompt, } = useNotificaciones()

        /****************************************
         * Stores
         ****************************************/
        const store = useAuthenticationStore()
        const cargando = new StatusEssentialLoading()
        const subtipos = ref()
        const refArchivo = ref()
        const idRegistro = ref()
        const { vehiculos, filtrarVehiculos,
            empleados, filtrarEmpleados,
        } = useFiltrosListadosSelects(listadosAuxiliares)

        cargarVista(async () => {
            await obtenerListados({
                vehiculos: new VehiculoController(),
                empleados: { controller: new EmpleadoController(), params: { estado: 1 } },
            })
            vehiculos.value = listadosAuxiliares.vehiculos
            empleados.value = listadosAuxiliares.empleados
            registro.persona_registra = store.user.id
            registro.persona_reporta = store.user.id
        })

        const reglas = {
            vehiculo: { required },
            fecha: { required },
            tipo: { required },
            gravedad: { required },
            descripcion: { required },
            persona_reporta: { required },
        }
        const v$ = useVuelidate(reglas, registro)
        setValidador(v$.value)


        /****************************************
         * HOOKS
         ****************************************/
        onReestablecer(() => {
            registro.persona_registra = store.user.id
            registro.persona_reporta = store.user.id
            refArchivo.value.limpiarListado()
        })

        onConsultado(() => {
            setTimeout(() => {
                refArchivo.value.listarArchivosAlmacenados(registro.id)
            }, 1);
            subtipos.value = subtiposIncidentes
        })
        onGuardado((id: number) => {
            idRegistro.value = id
            setTimeout(async () => {
                await subirArchivos()
            }, 1)
        })
        onModificado((id: number) => {
            idRegistro.value = id
            setTimeout(async () => {
                await subirArchivos()
            }, 1)
        })

        /****************************************
         * Funciones
         ****************************************/
        async function subirArchivos() {
            await refArchivo.value.subir()
        }
        function filtrarSubtipos(val) {
            subtipos.value = subtiposIncidentes.filter((v) => v.tipo.indexOf(val) > -1)
        }

        return {
            mixin, registro, v$, accion, disabled,
            configuracionColumnas: configuracionColumnasRegistroIncidente,
            maskFecha, acciones,
            refArchivo,
            idRegistro,

            //listados
            vehiculos, filtrarVehiculos,
            empleados, filtrarEmpleados,
            tiposIncidentes, subtipos,


            //funciones
            filtrarSubtipos,
            ordenarLista,


        }
    }
})