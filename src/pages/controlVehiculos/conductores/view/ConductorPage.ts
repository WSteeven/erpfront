// Dependencies
import { defineComponent, reactive } from "vue";
import { required, minValue, maxValue } from "shared/i18n-validators";

//Components
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue';
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Conductor } from "../domain/Conductor";
import { ConductorController } from "../infraestructure/ConductorController";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { EmpleadoRoleController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoRolesController";
import useVuelidate from "@vuelidate/core";
import { configuracioncolumnasConductores } from "../domain/configuracionColumnasConductores";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { LocalStorage, date } from "quasar";
import { tiposLicencias } from "config/utils_vehiculos";
import { accionesTabla, maskFecha } from "config/utils";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { ComportamientoModalesConductores } from "../application/ComportamientoModalesConductores";
import { configuracionColumnasMultasConductores } from "../domain/configuracionColumnasMultasConductores";

// Logica y Controladores



export default defineComponent({
    components: { TabLayout, ModalesEntidad, EssentialTable, GestorArchivos },
    setup() {
        const mixin = new ContenedorSimpleMixin(Conductor, new ConductorController())
        const { entidad: conductor, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onReestablecer, onGuardado, onConsultado, onModificado } = mixin.useHooks()

        const empleado: Empleado = reactive(new Empleado())
        const statusLoading = new StatusEssentialLoading()
        const modales = new ComportamientoModalesConductores()

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
        onConsultado(() => {
            empleado.hydrate(conductor.info_empleado)
        })
        onReestablecer(() => {
            empleado.hydrate(new Empleado())
        })
        /*********************************
         * Funciones
        *********************************/
        async function obtenerEmpleado(empleadoId: number | null) {
            if (empleadoId != null) {
                statusLoading.activar()
                const { result } = await new EmpleadoController().consultar(empleadoId)
                console.log(result)
                empleado.hydrate(result)
                statusLoading.desactivar()
            }
        }
        function calcularFechaFinal() {
            // Paso 1: Se divide el string de fecha en dia, mes, año
            const partesFecha = conductor.inicio_vigencia!.split("-");
            const fecha = new Date(Number(partesFecha[2]), Number(partesFecha[1]) - 1, Number(partesFecha[0]));

            // Paso 2: Suma 5 años a la fecha
            fecha.setFullYear(fecha.getFullYear() + 5);
            //Paso 3: Se resta un día
            fecha.setDate(fecha.getDate() - 1)

            // Paso 4: Formatea la nueva fecha en el formato deseado (DD-MM-YYYY)
            const dia = fecha.getDate().toString().padStart(2, "0");
            const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
            const anio = fecha.getFullYear().toString();

            // Resultado final
            const nuevaFechaString = `${dia}-${mes}-${anio}`;
            conductor.fin_vigencia = nuevaFechaString
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
            }
        }



        empleados.value = listadosAuxiliares.empleados
        cantones.value = listadosAuxiliares.cantones
        return {
            mixin, conductor, disabled, accion, v$,
            configuracionColumnas: configuracioncolumnasConductores,
            columnasMultasConductor: configuracionColumnasMultasConductores, accionesTabla,
            empleado,
            maskFecha,
            modales,
            //botones
            abrirModalMultaConductor,


            //listados
            empleados, filtrarEmpleados, ordenarEmpleados, obtenerEmpleado,
            cantones,
            tiposLicencias,

            //funciones
            calcularFechaFinal,

        }
    }
})