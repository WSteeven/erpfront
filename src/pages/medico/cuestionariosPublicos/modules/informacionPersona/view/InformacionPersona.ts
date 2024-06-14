// Dependencias
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { autoidentificaciones_etnicas } from 'config/recursosHumanos.utils'
import { niveles_academicos, maskFecha } from 'config/utils'
import { defineComponent, reactive, ref } from 'vue'

// Logica y controladores
import { RespuestaCuestionarioEmpleado } from 'pages/medico/cuestionarioPsicosocial/domain/RespuestaCuestionarioEmpleado'
import { EstadoCivilController } from 'pages/recursosHumanos/estado-civil/infraestructure/EstadoCivilController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { ProvinciaController } from 'sistema/provincia/infraestructure/ProvinciaController'
import { Persona } from '../domain/Persona'
import { opcionesTiposCuestionarios } from 'config/utils/medico'
import { ValidarCedulaController } from 'shared/validadores/infraestructure/ValidarCedulaController'

export default defineComponent({
    props: {
        mixin: { // Para cuestionarios publicos
            type: Object as () => ContenedorSimpleMixin<RespuestaCuestionarioEmpleado>,
            required: true,
        },
        validador: {
            type: Object,
            required: true,
        },
        modelValue: {
            type: Object,
            required: true
        },
        tipoCuestionario: {
            type: Number,
            required: false,
        },
    },
    emits: ['cedula-validada'],
    setup(props, { emit }) {
        /*************
         * Variables
         *************/
        const persona = reactive(new Persona())
        const cedulaValida = ref(true)

        /*********
         * Mixin
         *********/
        const { listadosAuxiliares } = props.mixin.useReferencias()
        const { cargarVista, obtenerListados } = props.mixin.useComportamiento()

        cargarVista(async () => {
            await obtenerListados({
                cantones: new CantonController(),
                provincias: {
                    controller: new ProvinciaController(),
                    params: { pais_id: 66 }
                },
                estados_civiles: new EstadoCivilController(),
            })
        })

        /************
         * Funciones
         ************/
        const { cantones, filtrarCantones, provincias, filtrarProvincias, estadosCiviles, filtrarEstadosCiviles } = useFiltrosListadosSelects(listadosAuxiliares)

        const validarCedula = async (cedula) => {
            const validarCedulaController = new ValidarCedulaController()
            console.log(cedula)
            const { response } = await validarCedulaController.guardar({ cedula: cedula })
            emit('cedula-validada', response.data)
            console.log(response)
        }

        return {
            v$: props.validador,
            persona,
            cantones, filtrarCantones,
            provincias, filtrarProvincias,
            estadosCiviles, filtrarEstadosCiviles,
            niveles_academicos,
            maskFecha,
            autoidentificaciones_etnicas,
            mostrarConsumoDrogas: props.tipoCuestionario === opcionesTiposCuestionarios.CUESTIONARIO_DIAGNOSTICO_CONSUMO_DE_DROGAS,
            validarCedula,
        }
    }
})