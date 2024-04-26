//Dependencias
import { configuracionColumnasBitacoraVehicular } from '../domain/configuracionColumnasBitacoraVehicular';
import { configuracionColumnasActividadesRealizadas } from '../domain/configuracionColumnasActividadesRealizadas';
import { required, requiredIf } from "shared/i18n-validators";
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref } from "vue";

// componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue';
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
import { encontrarUltimoIdListado, notificarErrores, notificarMensajesError, obtenerFechaActual, } from 'shared/utils';
import { useNotificaciones } from 'shared/notificaciones';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController';
import { TicketController } from 'pages/gestionTickets/tickets/infraestructure/TicketController';
import { format } from '@formkit/tempo';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { optionsDefault, optionsEstados, optionsEstadosCualitativos, optionsEstadosExtintor, tabOptionsBitacoras } from 'config/vehiculos.utils';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { apiConfig, endpoints } from 'config/api';
import { AxiosResponse } from 'axios';


export default defineComponent({
    // name:'ControlDiarioVehiculo',
    components: { TabLayoutFilterTabs2, SelectorImagen, EssentialPopupEditableTable, },
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(BitacoraVehicular, new BitacoraVehicularController())
        const { entidad: bitacora, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados, reestablecer, listar } = mixin.useComportamiento()
        const { onReestablecer, onConsultado, onBeforeModificar } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto } = useNotificaciones()

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
        const bitacoraDefault = ref()
        const bloquear_km_tanque = ref(false)
        const tabDefecto = ref('0')
        const axios = AxiosHttpRepository.getInstance()


        cargarVista(async () => {
            usuarioDefault.value = await obtenerVehiculoAsignado()
            bitacoraDefault.value = await obtenerUltimaBitacora()
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
            cargarDatosBitacoraDefecto()
        })

        /****************************************
         * HOOKS
         ****************************************/
        //Estos metodos funcionan si no se usa el keep alive 
        onReestablecer(() => {
            cargarDatosDefecto()
            cargarDatosBitacoraDefecto()
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
        function filtrarBitacoras(tab: string) {
            tabDefecto.value = tab
            listar({ firmada: tab, chofer_id: store.user.id })
        }
        /**
         * La función obtiene el vehículo asignado para el usuario actual con un estado específico.
         * @returns La función `obtenerVehiculoAsignado` está devolviendo el primer elemento del array
         * `resultado` de la respuesta del método `listar` en la clase `AsignacionVehiculoController`.
         */
        async function obtenerVehiculoAsignado() {
            const response = (await new AsignacionVehiculoController().listar({ filtro: 1, responsable_id: store.user.id, estado: 'ACEPTADO' }))
            console.log(response)
            return response.result[0]
        }

        async function obtenerUltimaBitacora() {
            const response = (await new BitacoraVehicularController().listar({ chofer_id: store.user.id, vehiculo_id: bitacora.vehiculo, firmada: 1, filtrar: 1 }))
            console.log(response)
            return response.result[0]
        }


        /**
         * La función "cargarDatosDefecto" carga datos por defecto en el objeto "bitacora" basándose en
         * los valores de "usuarioDefault".
         */
        function cargarDatosDefecto() {
            if (usuarioDefault.value) {
                bitacora.vehiculo = usuarioDefault.value.vehiculo
                bitacora.vehiculo_id = usuarioDefault.value.vehiculo_id
                bitacora.chofer_id = usuarioDefault.value.responsable_id
                bitacora.chofer = usuarioDefault.value.responsable
                bitacora.fecha = obtenerFechaActual(maskFecha)
            }
        }

        function cargarDatosBitacoraDefecto() {
            if (bitacoraDefault.value) {
                bitacora.km_inicial = bitacoraDefault.value.km_final
                bitacora.tanque_inicio = bitacoraDefault.value.tanque_final
                bloquear_km_tanque.value = true
            } else { bloquear_km_tanque.value = false }
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

        function checkFinalizada(val, evt) {
            if (val) {
                confirmar('¿Está seguro de marcar como finalizada esta bitácora? Después de esto no podrás modificarla!', () =>
                    confirmar('Al dar click en OK se finalizará y se firmará automaticamente este registro!. ¿Desea continuar? ', async () => {
                        await firmarBitacora(bitacora.id!)
                        await reestablecer()
                    },
                        () => bitacora.firmada = false
                    ),
                    () => bitacora.firmada = false
                )
            }
        }

        async function firmarBitacora(id: number) {
            try {
                cargando.activar()
                const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.bitacoras_vehiculos) + '/firmar-bitacora/' + id
                const response: AxiosResponse = await axios.post(url)
                console.log(response)
                if (response.status = 200) notificarCorrecto(response.data.mensaje)
                //se filtra los registros para mostrar en el lado correcto la bitacora actualizada
                await filtrarBitacoras('1')
                //se manda a consultar la ultima bitacora, la que se actualizó recientemente
                bitacoraDefault.value = await obtenerUltimaBitacora()

                //se reestablece el formulario con los nuevos datos actualizados
                await reestablecer()
                return response
            } catch (error) {
                notificarErrores(error)
            } finally {
                cargando.desactivar()
            }
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

        const btnMarcarFinalizada: CustomActionTable = {
            titulo: 'Finalizar',
            icono: 'bi-check2-circle',
            color: 'positive',
            accion: async ({ entidad, posicion }) => {
                console.log('diste clic en finalizar')
                await firmarBitacora(entidad.id)
            },
            visible: () => tabDefecto.value === '0'
        }

        return {
            mixin, bitacora, disabled, v$, accion, acciones,
            configuracionColumnas: configuracionColumnasBitacoraVehicular,
            columnasActividades: configuracionColumnasActividadesRealizadas,
            maskFecha, accionesTabla,
            optionsDefault, optionsEstadosCualitativos, optionsEstados, optionsEstadosExtintor,
            accepted: ref('1'),
            tabDefecto,
            tabOptionsBitacoras,
            bloquear_km_tanque,

            //listados
            vehiculos, filtrarVehiculos,
            choferes, filtrarChoferes,
            tickets, filtrarTickets,
            tareas, filtrarTareas,

            TanqueFinalValido: computed(() => bitacora.tanque_final! <= 100 || bitacora.tanque_final! >= 0),

            //funciones
            optionsFecha,
            checkFinalizada,
            filtrarBitacoras,

            //botones de tabla
            btnAgregarActividad,
            btnMarcarFinalizada,
            btnEliminar,



        }
    }
})