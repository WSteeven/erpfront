// Dependencias
import { required } from 'shared/i18n-validators';
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue';

// Components
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue';
import SelectorImagen from 'components/SelectorImagen.vue';

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { Tanqueo } from '../domain/Tanqueo';
import { TanqueoController } from '../infraestructure/TanqueoController';
import { configuracionColumnasTanqueoCombustible } from '../domain/configuracionColumnasTanqueoCombustible';
import { maskFecha } from 'config/utils';
import { VehiculoController } from 'pages/controlVehiculos/vehiculos/infraestructure/VehiculoController';
import { AsignacionVehiculoController } from 'pages/controlVehiculos/asignarVehiculos/infraestructure/AsignacionVehiculoController';
import { useAuthenticationStore } from 'stores/authentication';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { useQuasar } from 'quasar';
import { useNotificacionStore } from 'stores/notificacion';
import { useCargandoStore } from 'stores/cargando';
import { obtenerFechaHoraActual } from 'shared/utils';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { CombustibleController } from 'pages/controlVehiculos/combustible/infraestructure/CombustibleController';

export default defineComponent({
    components: { TabLayout, SelectorImagen },
    setup() {

        const mixin = new ContenedorSimpleMixin(Tanqueo, new TanqueoController())
        const { entidad: tanqueo, disabled, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { onReestablecer } = mixin.useHooks()

        /****************************************
        * Stores
        ****************************************/
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const store = useAuthenticationStore()
        const cargando = new StatusEssentialLoading()


        const usuarioDefault = ref()
        const { vehiculos, filtrarVehiculos,
            combustibles, filtrarCombustibles,
        } = useFiltrosListadosSelects(listadosAuxiliares)

        cargarVista(async () => {
            usuarioDefault.value = await obtenerVehiculoAsignado()
            cargarDatosDefecto()
            await obtenerListados({
                vehiculos: new VehiculoController(),
                combustibles: new CombustibleController()
            })

            vehiculos.value = listadosAuxiliares.vehiculos
            combustibles.value = listadosAuxiliares.combustibles
        })

        /****************************************
        * HOOKS
        ****************************************/
        //Estos metodos funcionan si no se usa el keep alive
        onReestablecer(async () => {
            cargarDatosDefecto()
            tanqueo.fecha_hora = obtenerFechaHoraActual(maskFecha)
        })

        /****************************************
         * Funciones
         ****************************************/
        /**
         * La función 'cargarDatosDefecto' carga datos por defecto en el objeto 'bitacora' basándose en
         * los valores de 'usuarioDefault'.
         */
        function cargarDatosDefecto() {
            if (usuarioDefault.value) {
                tanqueo.vehiculo = usuarioDefault.value.vehiculo_id
                tanqueo.solicitante_id = usuarioDefault.value.responsable_id
                tanqueo.solicitante = usuarioDefault.value.responsable
                tanqueo.fecha_hora = obtenerFechaHoraActual(maskFecha)
            }
        }
        /**
         * La función obtiene el vehículo asignado para el usuario actual con un estado específico.
         * @returns La función `obtenerVehiculoAsignado` está devolviendo el primer elemento del array
         * `resultado` de la respuesta del método `listar` en la clase `AsignacionVehiculoController`.
         */
        async function obtenerVehiculoAsignado() {
            const response = (await new AsignacionVehiculoController().listar({ filtro: 1, responsable_id: store.user.id, estado: 'ACEPTADO' }))
            // console.log(response)
            return response.result[0]
        }

        //Reglas de validacion
        const reglas = {
            vehiculo: { required },
            fecha_hora: { required },
            km_tanqueo: { required },
            monto: { required },
            combustible: { required },
            imagen_comprobante: { required },
            imagen_tablero: { required },
        }

        const v$ = useVuelidate(reglas, tanqueo)
        setValidador(v$.value)



        return {
            mixin, tanqueo, disabled, v$,
            configuracionColumnas: configuracionColumnasTanqueoCombustible,
            maskFecha,

            // listados
            vehiculos, filtrarVehiculos,
            combustibles, filtrarCombustibles,


        }
    }
})
