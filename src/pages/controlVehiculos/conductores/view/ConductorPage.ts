// Dependencies
import { configuracioncolumnasConductores } from "../domain/configuracionColumnasConductores";
import { configuracionColumnasMultasConductores } from "../domain/configuracionColumnasMultasConductores";
import { defineComponent, reactive, ref } from "vue";
import { required, minValue, maxValue } from "shared/i18n-validators";

//Components
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue';
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';
import SolicitarFecha from 'shared/prompts/SolicitarFecha.vue'

// Logica y Controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Conductor } from "../domain/Conductor";
import { ConductorController } from "../infraestructure/ConductorController";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { EmpleadoRoleController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoRolesController";
import useVuelidate from "@vuelidate/core";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { LocalStorage, date } from "quasar";
import { tabOptionsConductores, tiposLicencias } from "config/utils_vehiculos";
import { acciones, accionesTabla, maskFecha } from "config/utils";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { ComportamientoModalesConductores } from "../application/ComportamientoModalesConductores";
import { MultaConductorController } from "../modules/multas/infraestructure/MultaConductorController";
import { useConductorStore } from "stores/vehiculos/conductor";
import { useNotificaciones } from "shared/notificaciones";
import { CustomActionPrompt } from "components/tables/domain/CustomActionPrompt";
import { obtenerFechaActual, sumarFechas } from "shared/utils";



export default defineComponent({
    components: { TabLayoutFilterTabs2, ModalesEntidad, EssentialTable, GestorArchivos, SolicitarFecha },
    setup() {
        const mixin = new ContenedorSimpleMixin(Conductor, new ConductorController())
        const { entidad: conductor, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
        const { onReestablecer, onGuardado, onConsultado, onModificado } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()

        const empleado: Empleado = reactive(new Empleado())
        const conductorStore = useConductorStore()
        const statusLoading = new StatusEssentialLoading()
        const modales = new ComportamientoModalesConductores()

        const dataMulta = {
            fecha_pago: null,
            comentario: null,
        }
        const mostrarSolicitarFecha = ref(false)

        cargarVista(async () => {
            await obtenerListados({
                empleados: {
                    controller: new EmpleadoRoleController(),
                    params: { roles: ['CHOFER'] }
                }
            })
            listadosAuxiliares.cantones = JSON.parse(LocalStorage.getItem('cantones')!.toString())
            cantones.value = JSON.parse(LocalStorage.getItem('cantones')!.toString())
        })

        /*****************************
         * VALIDACIONES
         ****************************/
        const reglas = {
            empleado: { required },
            tipo_licencia: { required },
            puntos: { required, maximo: maxValue(30), minimo: minValue(0) },
            inicio_vigencia: { required },
            fin_vigencia: { required },
        }
        const v$ = useVuelidate(reglas, conductor)
        setValidador(v$.value)

        /*********************************
         * Hooks
        *********************************/
        onConsultado(async () => {
            empleado.hydrate(conductor.info_empleado)
            await consultarMultasConductor()
        })
        onReestablecer(() => {
            empleado.hydrate(new Empleado())
            dataMulta.comentario = null
            dataMulta.fecha_pago = null
        })
        /*********************************
         * Funciones
        *********************************/
        async function guardado(data) {
            switch (data) {
                case 'MultaConductorPage':
                    await consultarMultasConductor()
                    break
                default:
                    console.log('No se recibio data')
            }
        }
        async function consultarMultasConductor() {
            const { result } = await new MultaConductorController().listar({ empleado_id: conductor.empleado })
            conductor.multas = result
        }
        async function obtenerEmpleado(empleadoId: number | null) {
            if (empleadoId != null) {
                statusLoading.activar()
                const { result } = await new EmpleadoController().consultar(empleadoId)
                console.log(result)
                empleado.hydrate(result)
                statusLoading.desactivar()
            }
        }

        async function filtrarConductores(tab: string) {
            switch (tab) {
                case '1':
                    listar({
                        'fin_vigencia[operator]': '>',
                        'fin_vigencia[value]': sumarFechas(obtenerFechaActual(), 0, 3, 0, 'YYYY-MM-DD'),
                    })
                    break
                case '2':
                    listar({
                        'fin_vigencia[operator]': '<=',
                        'fin_vigencia[value]': sumarFechas(obtenerFechaActual(), 0, 3, 0, 'YYYY-MM-DD'),
                    })
                    break
                default:
                    listar()
            }
        }
        async function fechaIngresada(fecha?) {
            console.log('Fecha ingresada: ', fecha)
            dataMulta.fecha_pago = fecha
            if (await conductorStore.pagarMulta(dataMulta)) consultarMultasConductor()
        }
        function calcularFechaFinal() {
            conductor.fin_vigencia = sumarFechas(conductor.inicio_vigencia!, 5, 0, -1)
        }

        /********************************
         * LISTADOS Y FILTROS
         ********************************/
        const {
            empleados, filtrarEmpleados, ordenarEmpleados,
            cantones,
        } = useFiltrosListadosSelects(listadosAuxiliares)

        /**************************************************************
         * Botones de tablas
         **************************************************************/
        const abrirModalMultaConductor: CustomActionTable = {
            titulo: 'Agregar multa',
            icono: 'bi-file-text',
            color: 'positive',
            tooltip: 'Agregar multa asociado al conductor',
            accion: () => {
                modales.abrirModalEntidad('MultaConductorPage')
            },
            visible: () => { return accion.value == acciones.nuevo || accion.value == acciones.editar }
        }
        const btnEditarMulta: CustomActionTable = {
            titulo: 'Editar',
            icono: 'bi-pencil-square',
            color: 'secondary',
            tooltip: 'Editar',
            accion: ({ entidad }) => {
                confirmar('¿Está seguro de marcar como pagada la multa?', async () => {
                    const data: CustomActionPrompt = {
                        titulo: 'Fecha de pago',
                        mensaje: '¿Tienes alguna observación al respecto?',
                        accion: async (data) => {
                            conductorStore.idMulta = entidad.id
                            dataMulta.comentario = data
                            if (dataMulta.fecha_pago == null) mostrarSolicitarFecha.value = true
                        }
                    }
                    prompt(data)
                })
            },
            visible: ({ entidad }) => { return (accion.value == acciones.nuevo || accion.value == acciones.editar) && !entidad.estado }
        }



        empleados.value = listadosAuxiliares.empleados
        cantones.value = listadosAuxiliares.cantones
        return {
            mixin, conductor, disabled, accion, v$, acciones,
            configuracionColumnas: configuracioncolumnasConductores,
            columnasMultasConductor: configuracionColumnasMultasConductores, accionesTabla,
            empleado,
            maskFecha,
            modales,
            mostrarSolicitarFecha,
            //botones
            abrirModalMultaConductor,
            btnEditarMulta,

            //tab
            tabOptionsConductores,

            //listados
            empleados, filtrarEmpleados, ordenarEmpleados, obtenerEmpleado,
            cantones,
            tiposLicencias,

            //funciones
            filtrarConductores,
            calcularFechaFinal,
            guardado,
            fechaIngresada,
        }
    }
})