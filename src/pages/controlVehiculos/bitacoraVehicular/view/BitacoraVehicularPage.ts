//Dependencias
import { configuracionColumnasBitacoraVehicular } from '../domain/configuracionColumnasBitacoraVehicular';
import { configuracionColumnasActividadesRealizadas } from '../domain/configuracionColumnasActividadesRealizadas';
import { required, requiredIf } from "shared/i18n-validators";
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, onBeforeUnmount, onMounted, onUnmounted, ref } from "vue";

// componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialPopupEditableTable from "components/tables/view/EssentialPopupEditableTable.vue"

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { BitacoraVehicular } from '../domain/BitacoraVehicular';
import { BitacoraVehicularController } from '../infraestructure/BitacoraVehicularController';
import { acciones, accionesTabla, convertir_fecha, maskFecha } from 'config/utils';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { useAuthenticationStore } from 'stores/authentication';
import { AsignacionVehiculoController } from 'pages/controlVehiculos/asignarVehiculos/infraestructure/AsignacionVehiculoController';
import { encontrarUltimoIdListado, obtenerFechaActual, } from 'shared/utils';
import { useNotificaciones } from 'shared/notificaciones';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt';
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController';
import { TicketController } from 'pages/gestionTickets/tickets/infraestructure/TicketController';
import { format } from '@formkit/tempo';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { optionsDefault, optionsEstados, optionsEstadosCualitativos, optionsEstadosExtintor } from 'config/vehiculos.utils';
import { useQuasar } from 'quasar';


export default defineComponent({
    // name:'ControlDiarioVehiculo',
    components: { TabLayout, SelectorImagen, EssentialPopupEditableTable, },
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(BitacoraVehicular, new BitacoraVehicularController())
        const { entidad: bitacora, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { onReestablecer, onConsultado, onBeforeModificar } = mixin.useHooks()
        const { confirmar, prompt, } = useNotificaciones()

        /****************************************
         * Stores
         ****************************************/
        const store = useAuthenticationStore()
        const cargando = new StatusEssentialLoading()

        const { vehiculos, filtrarVehiculos,
            empleados: choferes, filtrarEmpleados: filtrarChoferes,
            tareas, filtrarTareas,
            tickets, filtrarTickets,
        } = useFiltrosListadosSelects(listadosAuxiliares)
        const usuarioDefault = ref()


        cargarVista(async () => {
            usuarioDefault.value = await obtenerVehiculoAsignado()
            // await obtenerListados({
            //     empleados: new ChoferController(),
            //     vehiculos: new VehiculoController(),
            //     /* combustibles: {
            //         controller: new CombustibleController(),
            //         params: { campos: 'id,nombre' }
            //     } */
            // })
            //cargar datos por defecto
            cargarDatosDefecto()
        })

        /****************************************
         * HOOKS
         ****************************************/
        //Estos metodos funcionan si no se usa el keep alive 
        onReestablecer(() => {
            cargarDatosDefecto()
        })
        onConsultado(async () => {
            if (accion.value == acciones.editar) {
                cargando.activar()
                await obtenerListados({
                    tareas: { controller: new TareaController(), params: { campos: 'id,codigo_tarea,titulo' } },
                    tickets: {
                        controller: new TicketController(),
                        params: {
                            responsable_id: bitacora.chofer_id,
                            campos: 'id,codigo,asunto'
                        }
                    },
                })
                cargando.desactivar()
                tareas.value = listadosAuxiliares.tareas
                tickets.value = listadosAuxiliares.tareas
            }
        })
        onBeforeModificar(() => {
            bitacora.checklistAccesoriosVehiculo.bitacora_id = bitacora.id
            bitacora.checklistImagenVehiculo.bitacora_id = bitacora.id
            bitacora.checklistVehiculo.bitacora_id = bitacora.id
        })

        //Reglas de validacion
        const reglas = {
            fecha: { required },
            hora_salida: { required },
            hora_llegada: { requiredIf: requiredIf(() => accion.value == acciones.editar && bitacora.firmada) },
            km_inicial: { required },
            km_final: { requiredIf: requiredIf(() => accion.value == acciones.editar && bitacora.firmada) },
            tanque_inicio: { required },
            tanque_final: { required },
            vehiculo: { required },
        }
        const v$ = useVuelidate(reglas, bitacora)
        setValidador(v$.value)


        /****************************************
         * Funciones
         ****************************************/
        /**
         * La función obtiene el vehículo asignado para el usuario actual con un estado específico.
         * @returns La función `obtenerVehiculoAsignado` está devolviendo el primer elemento del array
         * `resultado` de la respuesta del método `listar` en la clase `AsignacionVehiculoController`.
         */
        async function obtenerVehiculoAsignado() {
            const response = (await new AsignacionVehiculoController().listar({ filtro: 1, responsable_id: store.user.id, estado: 'ACEPTADO' }))
            return response.result[0]
        }

        /**
         * La función "cargarDatosDefecto" carga datos por defecto en el objeto "bitacora" basándose en
         * los valores de "usuarioDefault".
         */
        function cargarDatosDefecto() {
            if (usuarioDefault.value) {
                bitacora.vehiculo = usuarioDefault.value.vehiculo
                bitacora.chofer_id = usuarioDefault.value.responsable_id
                bitacora.chofer = usuarioDefault.value.responsable
                bitacora.fecha = obtenerFechaActual(maskFecha)
            }
        }

        /**
         * La función `optionsFecha` comprueba si una fecha determinada se encuentra dentro del rango
         * de ayer y hoy.
         * @param date - El parámetro `date` es un objeto de fecha que se compara con la fecha de ayer
         * y la fecha de hoy.
         * @returns devuelve un valor booleano si la `fecha` se encuentra dentro del rango de ayer y hoy.
         */
        function optionsFecha(date) {
            const today = new Date()
            const yesterday = new Date(today.setDate(today.getDate() - 1))
            return date >= convertir_fecha(yesterday) && date <= convertir_fecha(new Date())
        }

        function eliminar({ posicion }) {
            confirmar('¿Está seguro de continuar?', () => bitacora.actividadesRealizadas.splice(posicion, 1))
        }


        /****************************************
         * Botones de tabla
         ****************************************/
        const btnAgregarActividad: CustomActionTable = {
            titulo: 'Agregar Actividad',
            icono: 'bi-arrow-bar-down',
            color: 'positive',
            tooltip: 'Agregar actividad realizada',
            accion: () => {
                const fila = { 'id': null, 'fecha_hora': '', 'actividad': null }
                fila.id = bitacora.actividadesRealizadas.length ? encontrarUltimoIdListado(bitacora.actividadesRealizadas) + 1 : 1
                const fecha = new Date()
                fila.fecha_hora = format(fecha, 'YYYY-MM-DD HH:mm:ss', 'es')
                bitacora.actividadesRealizadas.unshift(fila)
                // emit('actualizar', bitacora.actividadesRealizadas)
            },
            visible: () => true
        }
        const btnEliminar: CustomActionTable = {
            titulo: 'Eliminar',
            icono: 'bi-trash',
            color: 'negative',
            accion: ({ entidad, posicion }) => {
                eliminar({ posicion })
            },
            visible: () => true
        }

        return {
            mixin, bitacora, disabled, v$, accion, acciones,
            configuracionColumnas: configuracionColumnasBitacoraVehicular,
            columnasActividades: configuracionColumnasActividadesRealizadas,
            maskFecha, accionesTabla,
            optionsDefault, optionsEstadosCualitativos, optionsEstados, optionsEstadosExtintor,
            accepted: ref('1'),

            //listados
            vehiculos, filtrarVehiculos,
            choferes, filtrarChoferes,
            tickets, filtrarTickets,
            tareas, filtrarTareas,

            TanqueFinalValido: computed(() => bitacora.tanque_final! <= 100 || bitacora.tanque_final! >= 0),

            //funciones
            optionsFecha,

            //botones de tabla
            btnAgregarActividad,
            btnEliminar,



        }
    }
})