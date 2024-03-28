//Dependencias
import { computed, defineComponent, ref } from "vue";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { configuracionColumnasAsignacionVehiculos } from "../domain/configuracionColumnasAsignacionVehiculos";

//Components
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue"

// Logica y controladores
import { AsignacionVehiculo } from "../domain/AsignacionVehiculo";
import { AsignacionVehiculoController } from "../infraestructure/AsignacionVehiculoController";
import { tabOptionsAsignacionVehiculos, estadosAsignacionesVehiculos } from "config/vehiculos.utils";
import { ConductorController } from "pages/controlVehiculos/conductores/infraestructure/ConductorController";
import { required } from "shared/i18n-validators";
import useVuelidate from "@vuelidate/core";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { imprimirArchivo, ordenarLista } from "shared/utils";
import { useAuthenticationStore } from "stores/authentication";
import { acciones, convertir_fecha, maskFecha } from "config/utils";
import { VehiculoController } from "pages/controlVehiculos/vehiculos/infraestructure/VehiculoController";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import EssentialLoading from "components/loading/view/EssentialLoading.vue";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { apiConfig, endpoints } from "config/api";
import { useNotificaciones } from "shared/notificaciones";
import { LocalStorage, useQuasar } from "quasar";
import { useNotificacionStore } from "stores/notificacion";
import { useCargandoStore } from "stores/cargando";


export default defineComponent({
    components: { TabLayoutFilterTabs2 },
    setup() {
        const mixin = new ContenedorSimpleMixin(AsignacionVehiculo, new AsignacionVehiculoController())
        const { entidad: asignacion, disabled, listadosAuxiliares, accion, listado } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar, } = mixin.useComportamiento()
        const { onConsultado, onReestablecer, onBeforeGuardar } = mixin.useHooks()
        const { notificarCorrecto, notificarAdvertencia, notificarError } = useNotificaciones()

        //stores
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const store = useAuthenticationStore()
        const cargando = new StatusEssentialLoading()

        const [pendiente, aceptado, rechazado, anulado] = estadosAsignacionesVehiculos
        const tabActual = ref(pendiente.label)
        // const puedeEditar = ref(false)
        const puedeEditar = computed(() => tabActual.value == pendiente.label && listado.value.some((item) => item.responsable_id == store.user.id))
        const soloLectura = computed(() => accion.value == acciones.editar)

        const {
            empleados, filtrarEmpleados,
            cantones, filtrarCantones,
            vehiculos, filtrarVehiculos } = useFiltrosListadosSelects(listadosAuxiliares)
        cargarVista(async () => {
            await obtenerListados({
                empleados: new ConductorController(),
                vehiculos: new VehiculoController(),
            })
            //listados
            empleados.value = listadosAuxiliares.empleados
            vehiculos.value = listadosAuxiliares.vehiculos
            listadosAuxiliares.cantones = JSON.parse(LocalStorage.getItem('cantones')!.toString())
            cantones.value = listadosAuxiliares.cantones

            asignacion.entrega = store.user.id
            asignacion.estado = pendiente.label
        })
        /*********************************
         * Validaciones
         *********************************/
        const reglas = {
            vehiculo: { required },
            responsable: { required },
            fecha_entrega: { required },
        }
        const v$ = useVuelidate(reglas, asignacion)
        setValidador(v$.value)


        /*********************************
         * Funciones
        *********************************/
        onReestablecer(() => {
            asignacion.entrega = store.user.id
            asignacion.estado = pendiente.label
        })
        /*********************************
         * Funciones
        *********************************/
        async function filtrarAsignaciones(tab: string) {
            tabActual.value = tab
            switch (tab) {
                case pendiente.label:
                    listar({
                        estado: pendiente.label,
                    })
                    break
                case 'FIRMADA': //aceptadas
                    listar({
                        estado: aceptado.label,
                    })
                    break
                case anulado.label:
                    listar({
                        estado: anulado.label,
                    })
                    break
                default: //aqui van las rechazadas
                    listar({
                        estado: rechazado.label,
                    })
            }
        }
        function optionsFecha(date) {
            const hoy = convertir_fecha(new Date())
            return date <= hoy
        }

        async function imprimirPdf(id: number, placa: string) {
            try {
                cargando.activar()
                const axios = AxiosHttpRepository.getInstance()
                const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.asignaciones_vehiculos) + '/imprimir/' + id
                const filename = 'acta_resposabilidad_vehiculo_' + placa + '_' + Date.now()
                imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
                console.log('Acta  impreso con éxito')
            } catch (e) {
                notificarAdvertencia('Error al imprimir el acta. ' + e)
            } finally {
                cargando.desactivar()
            }
        }

        /**************************
        * Botones de tabla
        ***************************/
        const btnImprimirActaResponsabilidad: CustomActionTable = {
            titulo: 'Imprimir Acta',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad }) => {
                await imprimirPdf(entidad.id, entidad.vehiculo)
            },
            visible: () => tabActual.value === 'FIRMADA'
        }

        return {
            mixin, v$, accion, acciones, disabled,
            tabActual,
            asignacion,
            configuracionColumnas: configuracionColumnasAsignacionVehiculos,
            tabOptions: tabOptionsAsignacionVehiculos,
            maskFecha,
            store,
            puedeEditar, soloLectura,


            //listados
            empleados, filtrarEmpleados,
            vehiculos, filtrarVehiculos,
            cantones, filtrarCantones,
            estadosAsignacionesVehiculos,


            //funciones
            filtrarAsignaciones,
            ordenarLista,
            optionsFecha,

            //botones de tablas
            btnImprimirActaResponsabilidad,
        }
    }
})