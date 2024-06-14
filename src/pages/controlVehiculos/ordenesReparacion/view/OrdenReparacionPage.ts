//Dependencias
import { defineComponent, ref } from "vue";
import { configuracionColumnasOrdenesReparaciones } from "../domain/configuracionColumnasOrdenesReparacion";

//Componentes
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";
import EssentialTable from "components/tables/view/EssentialTable";
import GestorArchivos from "components/gestorArchivos/GestorArchivos.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { OrdenReparacion } from "../domain/OrdenReparacion";
import { OrdenReparacionController } from "../infraestructure/OrdenReparacionController";
import { useNotificaciones } from "shared/notificaciones";
import { tabOptionsOrdenesReparaciones } from "config/vehiculos.utils";
import { useAuthenticationStore } from "stores/authentication";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { ServicioController } from "pages/controlVehiculos/servicios/infraestructure/ServicioController";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { required } from "shared/i18n-validators";
import useVuelidate from "@vuelidate/core";
import { obtenerFechaActual } from "shared/utils";
import { acciones, autorizaciones, maskFecha } from "config/utils";
import { AsignacionVehiculoController } from "pages/controlVehiculos/asignarVehiculos/infraestructure/AsignacionVehiculoController";
import { TransferenciaVehiculoController } from "pages/controlVehiculos/transferenciaVehiculos/infraestructure/TransferenciaVehiculoController";


export default defineComponent({
    components: { TabLayoutFilterTabs2, EssentialTable, GestorArchivos },
    setup() {
        const mixin = new ContenedorSimpleMixin(OrdenReparacion, new OrdenReparacionController())
        const { entidad: orden, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados, listar } = mixin.useComportamiento()
        const { onReestablecer, onConsultado, onGuardado, onModificado } = mixin.useHooks()
        const { confirmar, prompt, } = useNotificaciones()
        /****************************************
        * Stores
        ****************************************/
        const store = useAuthenticationStore()
        const cargando = new StatusEssentialLoading()

        const refArchivo = ref()
        const idOrden = ref()
        const tabActual = ref('1')
        const usuarioDefault = ref()

        const { servicios, filtrarServicios } = useFiltrosListadosSelects(listadosAuxiliares)
        cargarVista(async () => {
            usuarioDefault.value = await obtenerVehiculoAsignado()
            await obtenerListados({
                servicios: { controller: new ServicioController(), params: { tipo: 'CORRECTIVO', estado: 1 } },
            })
            servicios.value = listadosAuxiliares.servicios
            cargarDatosDefecto()
        })

        //Reglas de validacion
        const reglas = {
            solicitante: { required },
            vehiculo: { required },
            fecha: { required },
            autorizacion: { required },
            observacion: { required },
        }
        const v$ = useVuelidate(reglas, orden)
        setValidador(v$.value)

        /****************************************
         * HOOKS
         ****************************************/
        //Estos metodos funcionan si no se usa el keep alive
        onReestablecer(() => {
            refArchivo.value.limpiarListado()
            cargarDatosDefecto()
        })
        onConsultado(() => {
            setTimeout(() => {
                refArchivo.value.listarArchivosAlmacenados(orden.id)
            }, 1);
        })
        onGuardado((id: number) => {
            idOrden.value = id
            setTimeout(() => subirArchivos(), 1)
        })
        onModificado((id: number) => {
            idOrden.value = id
            setTimeout(() => subirArchivos(), 1)
        })

        /****************************************
         * Funciones
         ****************************************/
        async function filtrarOrdenesReparaciones(tab: string) {
            tabActual.value = tab
            listar({ autorizacion_id: tab })

        }
        async function subirArchivos() {
            await refArchivo.value.subir()
        }
        /**
         * La función obtiene el vehículo asignado para el usuario actual con un estado específico.
         * @returns La función `obtenerVehiculoAsignado` está devolviendo el primer elemento del array
         * `resultado` de la respuesta del método `listar` en la clase `AsignacionVehiculoController`.
         */
        async function obtenerVehiculoAsignado() {
            const response = (await new AsignacionVehiculoController().listar({ filtro: 1, responsable_id: store.user.id, estado: 'ACEPTADO' }))
            console.log(response)
            if(response.result.length==0){
              const response = (await new TransferenciaVehiculoController().listar({ responsable_id: store.user.id, estado: 'ACEPTADO' }))
              console.log(response)
              return response.result[0]
            }else{
              return response.result[0]
            }
        }
        function cargarDatosDefecto() {
            if (usuarioDefault.value) {
                orden.vehiculo = usuarioDefault.value.vehiculo
                orden.solicitante_id = usuarioDefault.value.responsable_id
                orden.solicitante = usuarioDefault.value.responsable
                orden.autorizacion = 1
                orden.fecha = obtenerFechaActual(maskFecha)
            }
        }

        /****************************************
        * Botones de tabla
        ****************************************/

        return {
            mixin, orden, disabled, v$, accion, acciones, tabOptionsOrdenesReparaciones,
            configuracionColumnas: configuracionColumnasOrdenesReparaciones,

            tabActual,
            store,
            refArchivo,
            idOrden,

            //listados
            servicios, filtrarServicios,
            autorizaciones,

            //funciones
            filtrarOrdenesReparaciones,


            //botones de tabla

        }
    }
})
