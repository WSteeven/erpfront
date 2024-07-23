// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { helpers, required, requiredIf } from 'shared/i18n-validators'
import { SelectOption } from 'components/tables/domain/SelectOption'
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { opcionesTiposCuestionarios } from 'config/utils/medico'
import { useNotificaciones } from 'shared/notificaciones'
import { isAxiosError } from 'shared/utils'
import useVuelidate from '@vuelidate/core'

// Componentes
import CuestionarioDiagnosticoConsumoDrogasHeader from 'medico/cuestionarioPsicosocial/view/CuestionarioDiagnosticoConsumoDrogasPage.vue'
import InformacionPersona from 'medico/cuestionariosPublicos/modules/informacionPersona/view/InformacionPersona.vue'
import CuestionarioPsicosocialHeader from 'medico/cuestionarioPsicosocial/view/CuestionarioPsicosocialPage.vue'
import CuestionariosPage from 'medico/cuestionarioPsicosocial/view/CuestionariosPage.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'

// Logica y controladores
import { TipoCuestionarioController } from 'pages/medico/cuestionarioPsicosocial/infrestructure/TipoCuestionarioController'
import { PreguntaController } from 'pages/medico/pregunta/infrestructure/RespuestaCuestionarioEmpleadoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CuestionarioPublicoController } from '../infraestructure/CuestionarioPublicoController'
import { Cuestionario } from 'pages/medico/cuestionarioPsicosocial/domain/Cuestionario'
import { CuestionarioPublico } from '../domain/CuestionarioPublico'
import { useRoute } from 'vue-router'
import { FormularioCuestionario } from 'pages/medico/cuestionarioPsicosocial/domain/FormularioCuestionario'
import { LinkCuestionarioPublicoController } from 'pages/medico/reportesCuestionarios/infraestructure/LinkCuestionarioPublicoController'

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

        const linkActivo = ref(true)

        if (linkActivo.value) {

            cargarVista(async () => {
                await obtenerListados({
                    tiposCuestionarios: new TipoCuestionarioController(),
                })
                // listadosAuxiliares.tiposCuestionarios = [listadosAuxiliares.tiposCuestionarios[0]]
            })
        }

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
                cuestionarioPublico.formulario_cuestionario = result
                console.log(cuestionarioPublico.formulario_cuestionario)
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
            return cuestionarioPublico.cuestionario = cuestionarioPublico.formulario_cuestionario.map(
                (cuestionario: FormularioCuestionario) => {
                    const cuestionarioAux = new Cuestionario()
                    cuestionarioAux.respuesta_texto = typeof cuestionario.respuesta === 'string' ? cuestionario.respuesta : null
                    cuestionarioAux.id_cuestionario = typeof cuestionario.respuesta === 'string' ? cuestionario.cuestionario[0].id : cuestionario.respuesta
                    // cuestionarioAux.id_cuestionario = typeof cuestionario.respuesta === 'number' ? cuestionario.respuesta : null
                    return cuestionarioAux
                }
            )
        }
        /* const mapearRespuestas = () => {
            return cuestionarioPublico.cuestionario = cuestionarioPublico.cuestionario.map(
                (cuestionario: Cuestionario) => {
                    return {
                        respuesta_texto: typeof cuestionario.respuesta === 'string' ? cuestionario.respuesta : null,
                        id_cuestionario:
                            typeof cuestionario.respuesta === 'string'
                                ? cuestionario.cuestionario[0].id
                                : cuestionario.respuesta,
                    }
                }
            )
        } */

        const guardarCuestionario = async () => {
            confirmar(
                'Las respuestas serán enviadas y no podrán ser modificadas. ¿Desea continuar?',
                async () => {
                    try {
                        mapearRespuestas()
                        console.log(cuestionarioPublico)
                        await guardar(cuestionarioPublico)
                        cuestionarioPublico.cuestionario = []
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

        /* const cuestionarioLleno = (respuesta: string) => {
            notificarAdvertencia(respuesta)
        } */

        /*********
         * Reglas
         *********/
        const reglas = {
            cuestionario: { required },
            /* formulario_cuestionario: {
                $each: helpers.forEach({
                    respuesta: { required },
                }),
            }, */
            formulario_cuestionario: {
                $each: helpers.forEach({
                    respuesta: { requiredIf: requiredIf(() => tipoCuestionarioSeleccionado.value === 1) }
                }),
            },
            persona: {
                primer_nombre: { required },
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
                // ruc: { requiredIf: requiredIf(() => esDrogas.value) },
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

        const v$ = useVuelidate(reglas, cuestionarioPublico) //, { $externalResults })

        setValidador(v$.value)

        /*******
         * Init
         *******/
        // Establecer favicon
        const configuracionGeneralStore = useConfiguracionGeneralStore()

        configuracionGeneralStore.consultarConfiguracion().then(() =>
            configuracionGeneralStore.cambiarFavicon())

        // Titulo pagina
        const nombreEmpresa = computed(() => configuracionGeneralStore.configuracion?.nombre_empresa)
        watchEffect(() => document.title = nombreEmpresa.value ?? '')

        const route = useRoute()
        const identificador = route.params.identificador
        cuestionarioPublico.persona.nombre_empresa = identificador

        const consultarLiskActivo = async () => {
            const { result } = await new LinkCuestionarioPublicoController().listar({ link: identificador })
            linkActivo.value = result[0].activo
        }

        consultarLiskActivo()

        return {
            v$,
            linkActivo,
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