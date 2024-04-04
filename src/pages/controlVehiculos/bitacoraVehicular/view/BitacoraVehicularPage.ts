//Dependencias
import { configuracionColumnasBitacoraVehicular } from '../domain/configuracionColumnasBitacoraVehicular';
import { required, requiredIf } from "shared/i18n-validators";
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, onBeforeUnmount, onMounted, onUnmounted, ref } from "vue";

// componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { BitacoraVehicular } from '../domain/BitacoraVehicular';
import { BitacoraVehicularController } from '../infraestructure/BitacoraVehicularController';
import { acciones, convertir_fecha, maskFecha } from 'config/utils';
import { ChoferController } from 'pages/recursosHumanos/empleados/infraestructure/ChoferController';
import { VehiculoController } from 'pages/controlVehiculos/vehiculos/infraestructure/VehiculoController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { useAuthenticationStore } from 'stores/authentication';
import { AsignacionVehiculoController } from 'pages/controlVehiculos/asignarVehiculos/infraestructure/AsignacionVehiculoController';
import { obtenerFechaActual, sumarFechas } from 'shared/utils';


export default defineComponent({
    // name:'ControlDiarioVehiculo',
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(BitacoraVehicular, new BitacoraVehicularController())
        const { entidad: bitacora, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onReestablecer, onConsultado, } = mixin.useHooks()

        /****************************************
         * Stores
         ****************************************/
        const store = useAuthenticationStore()

        const { vehiculos, filtrarVehiculos,
            empleados: choferes, filtrarEmpleados: filtrarChoferes,
        } = useFiltrosListadosSelects(listadosAuxiliares)
        const usuarioDefault = ref()
        // const accepted = ref('1')
        const optionsDefault = [
            {
                label: '',
                value: 'success',
                color: 'green',
                checkedIcon: 'bi-check-circle-fill',
                uncheckedIcon: 'panorama_fish_eye',
                iconColor: 'green-2',
            },
            {
                label: '',
                value: 'warning',
                color: 'orange',
                checkedIcon: 'bi-check-circle-fill',
                uncheckedIcon: 'panorama_fish_eye',
            },
            {
                label: '',
                value: 'danger',
                color: 'red',
                checkedIcon: 'bi-check-circle-fill',
                uncheckedIcon: 'panorama_fish_eye',
            },
        ]
        cargarVista(async () => {
            usuarioDefault.value = await obtenerVehiculoAsignado()
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
        })

        /****************************************
         * HOOKS
         ****************************************/
        //Estos metodos funcionan si no se usa el keep alive 
        onMounted(() => {
            console.log('Se activo el onMounted')
        })
        onBeforeUnmount(() => {
            console.log('Se activo el onBeforeUnmount')
        })
        onUnmounted(() => {
            console.log('Se activo el onUnmounted')
        })
        onReestablecer(() => {
            cargarDatosDefecto()
        })

        //Reglas de validacion
        const reglas = {
            fecha: { required },
            hora_salida: { required },
            hora_llegada: { requiredIf: requiredIf(() => accion.value == acciones.editar) },
            km_inicial: { required },
            km_final: { requiredIf: requiredIf(() => accion.value == acciones.editar) },
            tanque_inicio: { required },
            tanque_final: { required },
            // chofer: { required },
            vehiculo: { required },
        }
        const v$ = useVuelidate(reglas, bitacora)
        setValidador(v$.value)
        /****************************************
         * Funciones
         ****************************************/
        /**
         * La función obtiene el vehículo asignado para el usuario actual con un estado específico.
         * @returns La función `obtenerVehiculoAsignado` está devolviendo el primer elemento del array
         * `resultado` de la respuesta del método `listar` en la clase `AsignacionVehiculoController`.
         */
        async function obtenerVehiculoAsignado() {
            store.user.id
            const response = (await new AsignacionVehiculoController().listar({ filtro: 1, responsable_id: store.user.id, estado: 'ACEPTADO' }))
            return response.result[0]
        }
        /**
         * La función "cargarDatosDefecto" carga datos por defecto en el objeto "bitacora" basándose en
         * los valores de "usuarioDefault".
         */
        function cargarDatosDefecto() {
            if (usuarioDefault.value) {
                bitacora.vehiculo = usuarioDefault.value.vehiculo
                bitacora.chofer_id = usuarioDefault.value.responsable_id
                bitacora.chofer = usuarioDefault.value.responsable
                bitacora.fecha = obtenerFechaActual(maskFecha)
            }
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

        return {
            mixin, bitacora, disabled, v$, accion, acciones,
            configuracionColumnas: configuracionColumnasBitacoraVehicular,
            maskFecha,
            optionsDefault,
            accepted: ref('1'),

            //listados
            vehiculos, filtrarVehiculos,
            choferes, filtrarChoferes,

            TanqueFinalValido: computed(() => bitacora.tanque_final! <= 100 || bitacora.tanque_final! >= 0),

            //funciones
            optionsFecha,

        }
    }
})