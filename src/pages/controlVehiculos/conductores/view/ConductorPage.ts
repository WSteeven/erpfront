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
import { LocalStorage } from "quasar";
import { tiposLicencias } from "config/utils_vehiculos";

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

        /********************************
         * LISTADOS Y FILTROS
         ********************************/
        const {
            empleados, filtrarEmpleados, ordenarEmpleados,
            cantones,
        } = useFiltrosListadosSelects(listadosAuxiliares)

        empleados.value = listadosAuxiliares.empleados
        cantones.value = listadosAuxiliares.cantones
        return {
            mixin, conductor, disabled, accion, v$,
            configuracionColumnas: configuracioncolumnasConductores,
            empleado,


            //listados
            empleados, filtrarEmpleados, ordenarEmpleados, obtenerEmpleado,
            cantones,
            tiposLicencias,



        }
    }
})