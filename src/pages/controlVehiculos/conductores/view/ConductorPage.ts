// Dependencies
import { configuracionColumnasMultasConductores } from '../domain/configuracionColumnasMultasConductores';
import { configuracioncolumnasConductores } from '../domain/configuracionColumnasConductores';
import { required, minValue, maxValue } from 'shared/i18n-validators';
import { acciones, accionesTabla, maskFecha } from 'config/utils';
import { defineComponent, reactive, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { LocalStorage, } from 'quasar';

//Components
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue';
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue';
import InformacionLicencia from '../view/InformacionLicencia.vue'
import SolicitarFecha from 'shared/prompts/SolicitarFecha.vue'

// Logica y Controladores
import { EmpleadoRoleController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoRolesController';
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController';
import { MultaConductorController } from '../modules/multas/infraestructure/MultaConductorController';
import { ComportamientoModalesConductores } from '../application/ComportamientoModalesConductores';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import { tabOptionsConductores, tiposLicencias } from 'config/vehiculos.utils';
import { ConductorController } from '../infraestructure/ConductorController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado';
import { useConductorStore } from 'stores/vehiculos/conductor';
import { useNotificaciones } from 'shared/notificaciones';
import { Conductor } from '../domain/Conductor';




export default defineComponent({
    components: { TabLayout, ModalesEntidad, EssentialTable, GestorArchivos, SolicitarFecha, InformacionLicencia },
    setup() {
        const mixin = new ContenedorSimpleMixin(Conductor, new ConductorController())
        const { entidad: conductor, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, consultar } = mixin.useComportamiento()
        const { onReestablecer,  onConsultado } = mixin.useHooks()
        const { confirmar, prompt,  } = useNotificaciones()

        const empleado: Empleado = reactive(new Empleado())
        const conductorStore = useConductorStore()
        const cargando = new StatusEssentialLoading()

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
        }
        const v$ = useVuelidate(reglas, conductor)
        setValidador(v$.value)

        /*********************************
         * Hooks
        *********************************/
        onConsultado(async () => {
            empleado.hydrate(conductor.info_empleado)
            await consultarMultasConductor()

            conductorStore.conductor = conductor
        })
        onReestablecer(() => {
            empleado.hydrate(new Empleado())
            dataMulta.comentario = null
            dataMulta.fecha_pago = null
            conductorStore.resetearConductor()
        })
        /*********************************
         * Funciones
        *********************************/
        async function guardado(data) {
            switch (data) {
                case 'MultaConductorPage':
                    console.log('Antes de consultar', conductor.id)
                    await consultar(conductor)
                    console.log('Luego de consultar', conductor.id)
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
                cargando.activar()
                const { result } = await new EmpleadoController().consultar(empleadoId)
                // console.log(result)
                empleado.hydrate(result)
                cargando.desactivar()
            }
        }


        async function recargarChoferes() {
            cargando.activar()
            listadosAuxiliares.empleados = (await new EmpleadoRoleController().listar({ roles: ['CHOFER'] })).result
            empleados.value = listadosAuxiliares.empleados
            cargando.desactivar()
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
            visible: () => { return accion.value == acciones.editar }
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
            guardado,
            recargarChoferes,
        }
    }
})