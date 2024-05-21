import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";
import { defineComponent } from "vue";
import { MantenimientoVehiculo } from "../domain/MantenimientoVehiculo";
import { MantenimientoVehiculoController } from "../infraestructure/MantenimientoVehiculoController";
import { useNotificaciones } from "shared/notificaciones";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";
import { useCargandoStore } from "stores/cargando";
import { useAuthenticationStore } from "stores/authentication";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { VehiculoController } from "pages/controlVehiculos/vehiculos/infraestructure/VehiculoController";
import { ServicioController } from "pages/controlVehiculos/servicios/infraestructure/ServicioController";
import { acciones, accionesTabla } from "config/utils";
import { requiredIf } from "shared/i18n-validators";
import useVuelidate from "@vuelidate/core";
import { estadosMantenimientosVehiculos, tabOptionsMantenimientosVehiculos } from "config/vehiculos.utils";
import { configuracionColumnasMantenimientosVehiculos } from "../domain/configuracionColumnasMantenimientosVehiculos";
import { ref } from "vue";

export default defineComponent({
    components: { TabLayoutFilterTabs2 },
    setup() {
        const mixin = new ContenedorSimpleMixin(MantenimientoVehiculo, new MantenimientoVehiculoController())
        const { entidad: mantenimiento, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados, reestablecer, listar, editar } = mixin.useComportamiento()
        const { onReestablecer, onConsultado, onBeforeModificar } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarAdvertencia, notificarError } = useNotificaciones()

        /****************************************
         * Stores
         ****************************************/
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const store = useAuthenticationStore()
        const cargando = new StatusEssentialLoading()

        const tabDefecto = ref()

        const { vehiculos, filtrarVehiculos,
            empleados, filtrarEmpleados,
            servicios, filtrarServicios,
        } = useFiltrosListadosSelects(listadosAuxiliares)
        cargarVista(async () => {
            await obtenerListados({
                empleados: {
                    controller: new EmpleadoController(),
                    params: { estado: 1 }
                },
                vehiculos: { controller: new VehiculoController(), params: { estado: 1 } },
                servicios: { controller: new ServicioController(), params: { tipo: 'PREVENTIVO', estado: 1 } }
            })
            empleados.value = listadosAuxiliares.empleados
            vehiculos.value = listadosAuxiliares.vehiculos
            servicios.value = listadosAuxiliares.servicios
        })

        /**************************************************************
         * HOOKS
        **************************************************************/


        /**************************************************************
         * Reglas de validacion
        **************************************************************/
        const reglas = {
            fecha_realizado: { requiredIf: requiredIf(() => mantenimiento.estado === 'REALIZADO') }
        }

        const v$ = useVuelidate(reglas, mantenimiento)
        setValidador(v$.value)

        /**************************************************************
         * Funciones
        **************************************************************/
        function filtrarMantenimientos(tab: string) {
            tabDefecto.value = tab
            listar({ estado: tab })
        }


        /**************************************************************
         * Botones de tabla
        **************************************************************/




        return {
            mixin, v$, mantenimiento, disabled, accion, acciones,
            configuracionColumnas: configuracionColumnasMantenimientosVehiculos,
            accionesTabla,
            tabDefecto,

            // listados
            vehiculos, filtrarVehiculos,
            empleados, filtrarEmpleados,
            servicios, filtrarServicios,
            estadosMantenimientosVehiculos,
            tabOptions: tabOptionsMantenimientosVehiculos,

            // funciones
            filtrarMantenimientos,


        }
    }
})