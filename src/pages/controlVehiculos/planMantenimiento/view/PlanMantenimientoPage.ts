//Dependencias
import { configuracionColumnasPlanMantenimiento } from '../domain/configuracionColumnasPlanMantenimiento';
import { configuracionColumnasServicios } from 'pages/controlVehiculos/servicios/domain/configuracionColumnasServicios';
import { required } from 'shared/i18n-validators';
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, reactive, ref } from 'vue';

// componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue';

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { PlanMantenimiento } from '../domain/PlanMantenimiento';
import { PlanMantenimientoController } from '../infraestructure/PlanMantenimientoController';
import { VehiculoController } from 'pages/controlVehiculos/vehiculos/infraestructure/VehiculoController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { ServicioController } from 'pages/controlVehiculos/servicios/infraestructure/ServicioController';
import { acciones, accionesTabla } from 'config/utils';
import { useAuthenticationStore } from 'stores/authentication';
import { useOrquestadorSelectorServicios } from '../application/OrquestadorSelectorServicios';
import { useNotificaciones } from 'shared/notificaciones';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt';
import { ComportamientoModalesPlanMantenimiento } from '../application/ComportamientoModalesPlanMantenimiento';
import { useQuasar } from 'quasar';
import { useNotificacionStore } from 'stores/notificacion';
import { useCargandoStore } from 'stores/cargando';
import { Vehiculo } from 'pages/controlVehiculos/vehiculos/domain/Vehiculo';


export default defineComponent({
    components: { TabLayout, EssentialTable, EssentialSelectableTable, ModalesEntidad, },
    setup() {
        const mixin = new ContenedorSimpleMixin(PlanMantenimiento, new PlanMantenimientoController())
        const { entidad: plan, listado, accion, disabled, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onConsultado, onReestablecer, onBeforeConsultar } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()

        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const store = useAuthenticationStore()
        const serviciosSeleccionados = ref()
        const vehiculo = reactive(new Vehiculo())

        //modales
        const modales = new ComportamientoModalesPlanMantenimiento()

        // Orquestador
        const {
            refListadoSeleccionable: refListado,
            criterioBusqueda: criterioBusqueda,
            listado: listadoServicios,
            listar: listarServicios,
            limpiar: limpiarServicios,
            seleccionar: seleccionarServicio
        } = useOrquestadorSelectorServicios(plan, 'servicios')

        /********************************
         * HOOKS
         ********************************/
        onBeforeConsultar(() => {
            plan.hydrate(new PlanMantenimiento())
        })
        onConsultado(() => {
            const vehiculoSeleccionado = vehiculos.value.filter((v) => v.id === plan.vehiculo)[0]
            console.log(vehiculoSeleccionado)
            vehiculo.hydrate(vehiculoSeleccionado)
        })
        onReestablecer(() => {
            vehiculo.hydrate(new Vehiculo())
        })

        /********************************
         * LISTADOS Y FILTROS
         ********************************/
        const {
            vehiculos, filtrarVehiculos,
            // servicios, filtrarServicios,
        } = useFiltrosListadosSelects(listadosAuxiliares)

        cargarVista(async () => {
            await obtenerListados({
                vehiculos: {
                    controller: new VehiculoController(),
                    params: { campos: 'id,placa,modelo_id' }
                },
                // servicios: {
                //     infraestructure: new ServicioController(),
                //     params: { tipo: 'PREVENTIVO', estado: 1 }
                // }
            })
            vehiculos.value = listadosAuxiliares.vehiculos
            // servicios.value = listadosAuxiliares.servicios
        })
        /**************************************************************
        * Validaciones
        **************************************************************/
        const reglas = {
            vehiculo: { required },
            aplicar_desde: { required },
        }
        const v$ = useVuelidate(reglas, plan)
        setValidador(v$.value)

        /*******************************************************************************************
         * Funciones
         ******************************************************************************************/
        function eliminar({ posicion }) {
            confirmar('¿Está seguro de continuar?', () => plan.listadoServicios.splice(posicion, 1))
        }
        function guardado(data) {
            console.log(data)
            if (data.formulario == 'ServicioPage') {
                plan.listadoServicios.push(data.modelo)
            }
        }
        /*******************************************************************************************
         * Botones de tabla
         ******************************************************************************************/
        const btnEliminarFila: CustomActionTable = {
            titulo: 'Eliminar',
            icono: 'bi-trash',
            color: 'negative',
            accion: ({ entidad, posicion }) => {
                //: props.propsTable.rowIndex,
                eliminar({ posicion })
            },
            visible: () => (accion.value == acciones.nuevo || accion.value == acciones.editar) && (store.esAdministradorVehiculos || store.esAdministrador)
        }
        const btnEditarFila: CustomActionTable = {
            titulo: 'Cantidad',
            icono: 'bi-pencil',
            accion: ({ posicion }) => {
                const data: CustomActionPrompt = {
                    titulo: 'Modifica',
                    mensaje: 'Ingresa cada cuántos  KM se aplicará este servicio',
                    tipo: 'number',
                    defecto: plan.listadoServicios[posicion].intervalo,
                    accion: (data) => plan.listadoServicios[posicion].intervalo = data,
                }
                prompt(data)
            },
            visible: () => {
                return accion.value == acciones.consultar ? false : true
            }
        }
        const btnEditarNotificar: CustomActionTable = {
            titulo: 'Notificación',
            color: 'positive',
            icono: 'bi-bell-fill',
            accion: ({ posicion }) => {
                const data: CustomActionPrompt = {
                    titulo: 'Modifica',
                    mensaje: 'Ingresa los KM faltantes donde se realizará la notificación automática',
                    tipo: 'number',
                    validacion: (val) => Number.isInteger(parseFloat(val)),
                    defecto: plan.listadoServicios[posicion].notificar_antes,
                    accion: (data) => plan.listadoServicios[posicion].notificar_antes = data,
                }
                prompt(data)
            },
            visible: () => {
                return accion.value == acciones.consultar ? false : true
            }
        }
        const btnAgregarServicio: CustomActionTable = {
            titulo: 'Agregar Servicio',
            icono: 'bi-plus',
            tooltip: 'Agregar nuevo servicio',
            accion: () => {
                modales.abrirModalEntidad('ServicioPage')
            },
            visible: () => accion.value == acciones.nuevo || accion.value == acciones.editar
        }


        /***************************
         * Configuracion de columnas
         ****************************/
        configuracionColumnasServicios.splice(4, 1)
        configuracionColumnasServicios.find((item) => item.field == 'nombre')!.editable = false
        configuracionColumnasServicios.find((item) => item.field == 'intervalo')!.editable = true
        configuracionColumnasServicios.find((item) => item.field == 'intervalo')!.type = 'number'
        configuracionColumnasServicios.find((item) => item.field == 'notificar_antes')!.editable = true
        configuracionColumnasServicios.find((item) => item.field == 'notificar_antes')!.type = 'number'

        const configuracionColumnsServicios = [...configuracionColumnasServicios, {
            name: 'datos_adicionales',
            field: 'datos_adicionales',
            label: 'Datos adicionales',
            align: 'left',
            editable: true,
        }]


        return {
            mixin, v$, plan, disabled, accion, acciones,
            configuracionColumnas: configuracionColumnasPlanMantenimiento,
            configuracionColumnasServicios: configuracionColumnsServicios, accionesTabla,
            modales,
            vehiculo,
            //listados
            vehiculos, filtrarVehiculos,
            // servicios, filtrarServicios,

            serviciosSeleccionados,
            adminVehiculos: store.esAdministradorVehiculos,

            //selector
            refListado,
            criterioBusqueda,
            listadoServicios,
            listarServicios,
            limpiarServicios,
            seleccionarServicio,
            guardado,

            //funciones


            //botones de tabla
            btnEditarFila,
            btnEliminarFila,
            btnAgregarServicio,
            btnEditarNotificar,


        }
    }
})
