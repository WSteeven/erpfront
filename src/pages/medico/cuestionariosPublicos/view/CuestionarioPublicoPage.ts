// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { SelectOption } from 'components/tables/domain/SelectOption'
import { opcionesTiposCuestionarios } from 'config/utils/medico'
import { useNotificaciones } from 'shared/notificaciones'
import { required, requiredIf } from 'shared/i18n-validators'
import { isAxiosError } from 'shared/utils'
import { computed, defineComponent, ref, watchEffect } from 'vue'
import useVuelidate from '@vuelidate/core'

// Componentes
import CuestionariosPage from 'medico/cuestionarioPsicosocial/view/CuestionariosPage.vue'
import InformacionPersona from 'medico/cuestionariosPublicos/modules/informacionPersona/view/InformacionPersona.vue'
import CuestionarioDiagnosticoConsumoDrogasHeader from 'medico/cuestionarioPsicosocial/view/CuestionarioDiagnosticoConsumoDrogasPage.vue'
import CuestionarioPsicosocialHeader from 'medico/cuestionarioPsicosocial/view/CuestionarioPsicosocialPage.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'

// Logica y controladores
import { CuestionarioPublicoController } from '../infraestructure/CuestionarioPublicoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoCuestionarioController } from 'pages/medico/cuestionarioPsicosocial/infrestructure/TipoCuestionarioController'
import { PreguntaController } from 'pages/medico/pregunta/infrestructure/RespuestaCuestionarioEmpleadoController'
import { Cuestionario } from 'pages/medico/cuestionarioPsicosocial/domain/Cuestionario'
import { CuestionarioPublico } from '../domain/CuestionarioPublico'
import { ValidarCuestionarioLleno } from 'pages/medico/cuestionarioPsicosocial/application/ValidarCuestionarioLleno'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'

export default defineComponent({
    components: {
        CuestionariosPage,
        InformacionPersona,
        CuestionarioDiagnosticoConsumoDrogasHeader,
        CuestionarioPsicosocialHeader,
        ButtonSubmits,
    },
    setup() {
        /***********
         * Mixin
         ***********/
        const mixin = new ContenedorSimpleMixin(CuestionarioPublico, new CuestionarioPublicoController())
        const { cargarVista, obtenerListados, guardar, setValidador } = mixin.useComportamiento()
        const { entidad: cuestionarioPublico, listadosAuxiliares, accion } = mixin.useReferencias()

        cargarVista(async () => {
            await obtenerListados({
                tiposCuestionarios: new TipoCuestionarioController(),
                preguntas: [],
            })
            listadosAuxiliares.tiposCuestionarios = [listadosAuxiliares.tiposCuestionarios[0]]
        })

        /************
         * Variables
         ************/
        const refInformacionPersona = ref()
        const tipoCuestionarioSeleccionado = ref()
        const cargando = new StatusEssentialLoading()
        const { confirmar } = useNotificaciones()
        const mensaje = ref()
        const cedulaValida = ref(true)

        /****************
         * Controladores
         ****************/
        const preguntaController = new PreguntaController()

        /************
         * Funciones
         ************/
        async function consultarPreguntas(tipoCuestionario: number) {
            tipoCuestionarioSeleccionado.value = tipoCuestionario
            cargando.activar()
            try {
                const { result } = await preguntaController.listar({
                    tipo_cuestionario_id: tipoCuestionario,
                })
                listadosAuxiliares.preguntas = result
            } catch (e) {
                if (isAxiosError(e)) {
                    const mensajes: string[] = e.erroresValidacion
                    mensaje.value = mensajes[0]
                }
            } finally {
                cargando.desactivar()
            }
        }

        function mapearCuestionario(cuestionario: Cuestionario[]): SelectOption[] {
            return cuestionario.map((item: any) => {
                return {
                    ['label']: item.respuesta,
                    ['value']: item.id,
                }
            })
        }

        const mapearRespuestas = () => {
            return cuestionarioPublico.cuestionario = listadosAuxiliares.preguntas.map(
                (item: any) => {
                    return {
                        respuesta_texto: typeof item.respuesta === 'string' ? item.respuesta : null,
                        id_cuestionario:
                            typeof item.respuesta === 'string'
                                ? item.cuestionario[0].id
                                : item.respuesta,
                    }
                }
            )
        }

        const guardarCuestionario = async () => {
            confirmar(
                'Las respuestas serán enviadas y no podrán ser modificadas. ¿Desea continuar?',
                async () => {
                    try {
                        mapearRespuestas()
                        await guardar(cuestionarioPublico)
                        listadosAuxiliares.preguntas = []
                        mensaje.value = 'Gracias por completar el cuestionario.'
                    } catch (e) {
                        console.log(e)

                        if (isAxiosError(e)) {
                            const mensajes: string[] = e.erroresValidacion
                            console.log(mensajes)
                            mensaje.value = mensajes[0]
                        }
                    }
                }
            )
        }

        /*********
         * Reglas
         *********/
        const reglas = {
            cuestionario: { required },
            persona: {
                primer_nombre: { required: () => true },
                segundo_nombre: { required },
                primer_apellido: { required },
                segundo_apellido: { required },
                identificacion: { required },
                provincia: { required },
                canton: { required },
                area: { required },
                nivel_academico: { required },
                antiguedad: { required },
                correo: { required },
                estado_civil: { required },
                fecha_nacimiento: { required },
                genero: { required },
                nombre_empresa: { requiredIf: requiredIf(() => esDrogas.value) },
                ruc: { requiredIf: requiredIf(() => esDrogas.value) },
                cargo: { requiredIf: requiredIf(() => esDrogas.value) },
                tipo_afiliacion_seguridad_social: { requiredIf: requiredIf(() => esDrogas.value) },
                numero_hijos: { requiredIf: requiredIf(() => esDrogas.value) },
                autoidentificacion_etnica: { requiredIf: requiredIf(() => esDrogas.value) },
                porcentaje_discapacidad: { requiredIf: requiredIf(() => esDrogas.value && cuestionarioPublico.persona.discapacidad) },
                enfermedades_preexistentes: { requiredIf: requiredIf(() => esDrogas.value) },
                // cedula: { cedula_no_valida: true },
            }
        }

        const esDrogas = computed(() => tipoCuestionarioSeleccionado.value == opcionesTiposCuestionarios.CUESTIONARIO_DIAGNOSTICO_CONSUMO_DE_DROGAS)

        /* const $externalResults = ref({
            // foo: 'error', is also supported
            persona: {
                identificacion: 'cedula_no_valida', // is also supported
            },
            // foo: ['Error one', 'Error Two']
        }) // works with reactive({}) too. */

        const v$ = useVuelidate(reglas, cuestionarioPublico) //, { $externalResults })


        setValidador(v$.value)

        const validarCuestionarioLleno = new ValidarCuestionarioLleno(
            cuestionarioPublico
        )
        mixin.agregarValidaciones(validarCuestionarioLleno)

        // Establecer favicon
        const configuracionGeneralStore = useConfiguracionGeneralStore()

        configuracionGeneralStore.consultarConfiguracion().then(() =>
            configuracionGeneralStore.cambiarFavicon())

        // Titulo pagina
        const nombreEmpresa = computed(() => configuracionGeneralStore.configuracion?.nombre_empresa)
        watchEffect(() => document.title = nombreEmpresa.value ?? '')

        return {
            v$,
            refInformacionPersona,
            mixin,
            cuestionarioPublico,
            listadosAuxiliares,
            consultarPreguntas,
            opcionesTiposCuestionarios,
            mapearCuestionario,
            guardarCuestionario,
            mensaje,
            tipoCuestionarioSeleccionado,
            accion,
            cedulaValida,
        }
    }
})