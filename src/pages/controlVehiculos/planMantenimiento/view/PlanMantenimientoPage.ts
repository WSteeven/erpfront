//Dependencias
import { configuracionColumnasPlanMantenimiento } from '../domain/configuracionColumnasPlanMantenimiento';
import { configuracionColumnasServicios } from 'pages/controlVehiculos/servicios/domain/configuracionColumnasServicios';
import { required } from "shared/i18n-validators";
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref } from "vue";

// componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'

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


export default defineComponent({
    components: { TabLayout, EssentialTable, EssentialSelectableTable, },
    setup() {
        const mixin = new ContenedorSimpleMixin(PlanMantenimiento, new PlanMantenimientoController())
        const { entidad: plan, listado, accion, disabled, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()

        const store = useAuthenticationStore()
        const serviciosSeleccionados = ref()

        // Orquestador
        const {
            refListadoSeleccionable: refListado,
            criterioBusqueda: criterioBusqueda,
            listado: listadoServicios,
            listar: listarServicios,
            limpiar: limpiarServicios,
            seleccionar: seleccionarServicio
        } = useOrquestadorSelectorServicios(plan, 'servicios')

        cargarVista(async () => {
            await obtenerListados({
                vehiculos: {
                    controller: new VehiculoController(),
                    params: { campos: 'id,placa,marca,modelo' }
                },
                servicios: {
                    controller: new ServicioController(),
                    params: { tipo: 'PREVENTIVO', estado: 1 }

                }
            })
        })
        /**************************************************************
        * Validaciones
        **************************************************************/
        const reglas = {
            vehiculo: { required },
            comienza_km: { required },
        }
        const v$ = useVuelidate(reglas, plan)
        setValidador(v$.value)

        /*******************************************************************************************
         * Funciones
         ******************************************************************************************/
        function eliminar({ posicion }) {
            confirmar('¿Está seguro de continuar?', () => plan.listadoServicios.splice(posicion, 1))
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
            visible: () => (accion.value == acciones.nuevo || accion.value == acciones.editar) && store.esAdministradorVehiculos
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


        /***************************
         * Configuracion de columnas
         ****************************/
        configuracionColumnasServicios.splice(3, 1)
        configuracionColumnasServicios.find((item) => item.field == 'nombre')!.editable = false
        configuracionColumnasServicios.find((item) => item.field == 'intervalo')!.editable = true
        configuracionColumnasServicios.find((item) => item.field == 'intervalo')!.type = 'number'


        /********************************
         * LISTADOS Y FILTROS
         ********************************/
        const {
            vehiculos, filtrarVehiculos,
            servicios, filtrarServicios,
        } = useFiltrosListadosSelects(listadosAuxiliares)
        vehiculos.value = listadosAuxiliares.vehiculos
        servicios.value = listadosAuxiliares.servicios

        return {
            mixin, v$, plan, disabled, accion, acciones,
            configuracionColumnas: configuracionColumnasPlanMantenimiento,
            configuracionColumnasServicios, accionesTabla,
            //listados
            vehiculos, filtrarVehiculos,
            servicios, filtrarServicios,

            serviciosSeleccionados,
            adminVehiculos: store.esAdministradorVehiculos,

            //selector
            refListado,
            criterioBusqueda,
            listadoServicios,
            listarServicios,
            limpiarServicios,
            seleccionarServicio,

            //funciones


            //botones de tabla
            btnEditarFila,
            btnEliminarFila,


        }
    }
})