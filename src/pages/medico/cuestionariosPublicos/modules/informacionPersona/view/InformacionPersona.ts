// Dependencias
import { discapacidades, opcionesTiposCuestionarios, enfermedades, generos } from 'config/utils/medico'
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
import { ValidarCedulaController } from 'shared/validadores/infraestructure/ValidarCedulaController'
import { ValidarCuestionarioPublicoLlenoController } from 'shared/validadores/infraestructure/ValidarCuestionarioPublicoLlenoController'
import { useNotificaciones } from 'shared/notificaciones'
import { isApiError, notificarMensajesError } from 'shared/utils'

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
        const notificaciones = useNotificaciones()

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
        const { cantones, filtrarCantones, provincias, filtrarProvincias, estadosCiviles, filtrarEstadosCiviles, filtrarLista } = useFiltrosListadosSelects(listadosAuxiliares)

        const validarCedula = async (cedula) => {
            const validarCedulaController = new ValidarCedulaController()
            const { response } = await validarCedulaController.guardar({ cedula: cedula })
            emit('cedula-validada', response.data)
        }

        const validarCuestionarioLleno = async (cedula) => {
            try {
                const validarCuestionarioPublicoLlenoController = new ValidarCuestionarioPublicoLlenoController()
                await validarCuestionarioPublicoLlenoController.guardar({ identificacion: cedula, tipo_cuestionario_id: props.tipoCuestionario })
            } catch (error) {
                if (isApiError(error)) {
                    const mensajes: string[] = error.erroresValidacion
                    await notificarMensajesError(mensajes, notificaciones)
                }
                // notificarAdvertencia(e)
            }
        }

        const establecerPorcentajeDiscapacidad = (d) => {
            persona.porcentaje = d
            persona.porcentaje_discapacidad = persona.discapacidades + ' ' + d + '%'
            props.modelValue.persona.porcentaje_discapacidad = persona.discapacidades + ' ' + d + '%'
            props.modelValue.persona.porcentaje = d
        }

        const establecerDiscapacidades = (d) => {
            persona.discapacidades = d
            persona.porcentaje_discapacidad = d + ' ' + persona.porcentaje + '%'
            props.modelValue.persona.porcentaje_discapacidad = d + ' ' + persona.porcentaje + '%'
            props.modelValue.persona.discapacidades = d
        }

        /**********
         * Filtros
         **********/
        const enfermedadesPreexistentes = ref([])
        const filtrarEnfermedades = (val, update) => filtrarLista(val, update, enfermedadesPreexistentes, 'nombre', enfermedades)

        return {
            v$: props.validador,
            persona,
            cantones, filtrarCantones,
            provincias, filtrarProvincias,
            estadosCiviles, filtrarEstadosCiviles,
            enfermedadesPreexistentes, filtrarEnfermedades,
            niveles_academicos,
            maskFecha,
            autoidentificaciones_etnicas,
            mostrarConsumoDrogas: props.tipoCuestionario === opcionesTiposCuestionarios.CUESTIONARIO_DIAGNOSTICO_CONSUMO_DE_DROGAS,
            validarCedula,
            validarCuestionarioLleno,
            discapacidades,
            generos,
            establecerPorcentajeDiscapacidad,
            establecerDiscapacidades,
        }
    }
})