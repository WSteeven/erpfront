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
        const linkExiste = ref(true)

        /*************
         * Constantes
         *************/
        const CUESTIONARIO_OTROS = [407, 424] // TABLA med_cuestionarios,id son preguntas con respuesta OTROS
        const CUESTIONARIO_NO_CONSUME = [406, 385, 388, 419, 423] // TABLA med_cuestionarios,id son preguntas con respuesta NO CONSUME
        const PSICOSOCIAL = 1
        const ALCOHOL_DROGAS = 2

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
                    console.log(cuestionario)
                    const cuestionarioAux = new Cuestionario()
                    // cuestionarioAux.id_cuestionario = typeof cuestionario.respuesta === 'string' || typeof cuestionario.respuesta === 'object' ? cuestionario.cuestionario[0].id : cuestionario.respuesta
                    cuestionarioAux.respuesta_texto = getRespuestaTexto(cuestionario.respuesta) // typeof cuestionario.respuesta === 'string' ? cuestionario.respuesta : null
                    cuestionarioAux.id_cuestionario = getIdCuestionario(cuestionario) // typeof cuestionario.respuesta === 'number' ? cuestionario.respuesta : null
                    return cuestionarioAux
                }
            )
        }

        const getRespuestaTexto = (respuesta) => {
            if (typeof respuesta === 'string') {
                return respuesta
            } else if (typeof respuesta === 'object' && Array.isArray(respuesta)) {
                return buscarFactoresPsicosociales(respuesta) // respuesta.join(',')
            } else return null
        }

        const getIdCuestionario = (cuestionario) => {
            const respuesta = cuestionario.respuesta
            const primeraRespuestaDefecto = cuestionario.cuestionario[0].id

            if (typeof respuesta === 'number') {
                return respuesta
            } else if (typeof respuesta === 'object' && Array.isArray(respuesta)) {
                return respuesta[0]
            } else if (!respuesta || typeof respuesta === 'string') {
                return primeraRespuestaDefecto
            }
        }

        const noConsume = ref(false)
        const establecerNoConsume = (index: number, respuesta: number) => {
            if (index === 0 && respuesta === 406) { // No consume
                cuestionarioPublico.formulario_cuestionario[2].respuesta = 385 // No consume
                cuestionarioPublico.formulario_cuestionario[3].respuesta = 388 // No consume
                cuestionarioPublico.formulario_cuestionario[4].respuesta = [419] // No consume
                cuestionarioPublico.formulario_cuestionario[6].respuesta = 423 // No consume
                noConsume.value = true
            } else if (index === 0 && respuesta !== 406) {
                cuestionarioPublico.formulario_cuestionario[2].respuesta = null // No consume
                cuestionarioPublico.formulario_cuestionario[3].respuesta = null // No consume
                cuestionarioPublico.formulario_cuestionario[4].respuesta = null // No consume
                cuestionarioPublico.formulario_cuestionario[6].respuesta = null // No consume
                noConsume.value = false
            } else {
                noConsume.value = false
            }
        }

        const buscarFactoresPsicosociales = (idsFactores: number[]) => {
            const cuestionarios = cuestionarioPublico.formulario_cuestionario[4].cuestionario.filter((cuestionario) => cuestionario.id ? idsFactores.includes(cuestionario.id) : false)
            const texto = cuestionarios.map((c) => c.respuesta)
            console.log(texto)
            return texto.join(',')
        }

        /**
         * Deshabilitar todos los items de NO CONSUME excepto de la pregunta #1
         * @param cuestionario_id id del cuestionario
         * @param index indice de la pregunta
         * @returns 
         */
        const desahabilitarNoConsume = (cuestionario_id: number, index: number) => {
            if (index > 0) return cuestionarioPublico.formulario_cuestionario[0].respuesta !== 406 && CUESTIONARIO_NO_CONSUME.includes(cuestionario_id)
            else return false
        }

        const verificarSiEsSelectMultiple = (index: number) => {
            const valor = cuestionarioPublico.formulario_cuestionario[index - 1].respuesta // Valor pregunta anterior
            if (typeof valor === 'object' && Array.isArray(valor)) return valor.length ? seSeleccionoItemOtro(CUESTIONARIO_OTROS, valor) : false
            return valor ? CUESTIONARIO_OTROS.includes(valor) : false
        }

        const seSeleccionoItemOtro = (array2: number[], array1: number[]) => {
            let res = false
            for (const value of array2) {
                if (array1.includes(value)) {
                    res = true
                    break
                }
            }
            return res
        }

        const guardarCuestionario = async () => {
            confirmar(
                'Las respuestas serán enviadas y no podrán ser modificadas. ¿Desea continuar?',
                async () => {
                    try {
                        mapearRespuestas()
                        await guardar(cuestionarioPublico)
                        cuestionarioPublico.cuestionario = []
                        establecerNombreEmpresa()
                    } catch (e) {
                        if (isAxiosError(e)) {
                            const mensajes: string[] = e.erroresValidacion
                            console.log(mensajes)
                        }
                    }
                }
            )
        }

        const route = useRoute()
        const identificador = route.params.identificador

        const establecerNombreEmpresa = () => {
            cuestionarioPublico.persona.nombre_empresa = identificador
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
                    respuesta: {
                        requiredIf: requiredIf(() => tipoCuestionarioSeleccionado.value === PSICOSOCIAL),
                    }
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
                nivel_academico: { required },
                correo: { required },
                estado_civil: { required },
                fecha_nacimiento: { required },
                genero: { required },
                nombre_empresa: { requiredIf: requiredIf(() => esDrogas.value) },
                cargo: { requiredIf: requiredIf(() => esDrogas.value) },
                numero_hijos: { requiredIf: requiredIf(() => esDrogas.value) },
                autoidentificacion_etnica: { requiredIf: requiredIf(() => esDrogas.value) },
                porcentaje_discapacidad: { requiredIf: requiredIf(() => esDrogas.value && cuestionarioPublico.persona.discapacidad) },
                enfermedades_preexistentes: { requiredIf: requiredIf(() => esDrogas.value) },
                porcentaje: { requiredIf: requiredIf(() => esDrogas.value && cuestionarioPublico.persona.discapacidad) },
                discapacidades: { requiredIf: requiredIf(() => esDrogas.value && cuestionarioPublico.persona.discapacidad) },
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

        establecerNombreEmpresa()

        const consultarLinkActivo = async () => {
            const { result } = await new LinkCuestionarioPublicoController().listar({ link: identificador })
            linkActivo.value = result[0]?.activo
            linkExiste.value = result.length > 0
        }

        consultarLinkActivo()



        return {
            v$,
            linkActivo,
            linkExiste,
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
            CUESTIONARIO_OTROS,
            CUESTIONARIO_NO_CONSUME,
            ALCOHOL_DROGAS,
            establecerNoConsume,
            noConsume,
            desahabilitarNoConsume,
            verificarSiEsSelectMultiple,
        }
    }
})