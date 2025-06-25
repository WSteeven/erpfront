import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useAuthenticationStore } from 'stores/authentication'
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { useCargandoStore } from 'stores/cargando'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo } from 'shared/utils'
import { useMedicoStore } from 'stores/medico'
import { useQuasar } from 'quasar'

// Componentes
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'

// Logica y controladores
import { TipoEvaluacionMedicaRetiroController } from '../infraestructure/TipoEvaluacionMedicaRetiroController'
import { OpcionRespuestaTipoEvaluacionMedicaRetiro } from '../domain/OpcionRespuestaTipoEvaluacionMedicaRetiro'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoAptitudMedicaLaboralController } from '../infraestructure/TipoAptitudMedicaLaboralController'
import { FichaAptitudController } from '../infraestructure/FichaAptitudController'
import { TipoEvaluacionMedicaRetiro } from '../domain/TipoEvaluacionMedicaRetiro'
import { FichaAptitud } from '../domain/FichaAptitud'
import { acciones } from 'config/utils'

import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'

import { ArchivoController } from 'subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'

export default defineComponent({
  name: 'fichas_aptitudes',
  components: {
    GestorArchivos,
    SimpleLayout
  },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const medicoStore = useMedicoStore()
    const authenticationStore = useAuthenticationStore()
    useCargandoStore().setQuasar(useQuasar())

    /************
     * Variables
     ************/
    const refArchivo = ref()
    const respuestasTiposEvaluacionesMedicasRetiros = [
      ['SI', 'NO'],
      ['PRESUNTIVA', 'DEFINITIVA', 'NO APLICA'],
      ['SI', 'NO', 'NO APLICA']
    ]
    const tiposEvaluacionesMedicasRetiros = ref()

    /********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(
      FichaAptitud,
      new FichaAptitudController(),
      new ArchivoController()
    )
    const {
      entidad: fichaAptitud,
      listadosAuxiliares,
      disabled,
      accion
    } = mixin.useReferencias()
    const {
      setValidador,
      cargarVista,
      obtenerListados,
      consultar,
      editarParcial,
      listar
    } = mixin.useComportamiento()
    const { onBeforeGuardar, onReestablecer, onConsultado, onGuardado } =
      mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        tiposEvaluacionesMedicasRetiros:
          new TipoEvaluacionMedicaRetiroController(),
        tiposAptitudesMedicasLaborales: new TipoAptitudMedicaLaboralController()
      })

      tiposEvaluacionesMedicasRetiros.value =
        listadosAuxiliares.tiposEvaluacionesMedicasRetiros.map(
          (tipo: TipoEvaluacionMedicaRetiro, index: number) => {
            return {
              id: tipo.id,
              nombre: tipo.nombre,
              posibles_respuestas:
                respuestasTiposEvaluacionesMedicasRetiros[index],
              respuesta: null
            }
          }
        )

      watchEffect(() => {
        tiposEvaluacionesMedicasRetiros.value =
          tiposEvaluacionesMedicasRetiros.value?.map(tipo => {
            const opcion:
              | OpcionRespuestaTipoEvaluacionMedicaRetiro
              | undefined =
              fichaAptitud.opciones_respuestas_tipo_evaluacion_medica_retiro.find(
                (opcion: OpcionRespuestaTipoEvaluacionMedicaRetiro) =>
                  opcion.tipo_evaluacion_medica_retiro === tipo.id
              )
            tipo.respuesta = opcion?.respuesta
            return tipo
          })
      })
    })

    /************
     * Funciones
     ************/
    const descargarPdf = async () => {
      const axios = AxiosHttpRepository.getInstance()
      const url =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.fichas_aptitudes_imprimir) +
        '/' +
        fichaAptitud.id
      const filename = 'ficha_aptitud_' + fichaAptitud.id + '_' + Date.now()
      imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    }

    const firmarPaciente = async () => {
      if (fichaAptitud.id)
        editarParcial(fichaAptitud.id, {
          firmado_paciente: true
        })
    }

    /********
     * Hooks
     ********/
    onBeforeGuardar(() => {
      fichaAptitud.opciones_respuestas_tipo_evaluacion_medica_retiro =
        tiposEvaluacionesMedicasRetiros.value.map((tipo: any) => {
          return {
            respuesta: tipo.respuesta,
            tipo_evaluacion_medica_retiro: tipo.id
          }
        })
    })

    onGuardado((id: number) => (medicoStore.idFichaAptitud = id))

    onReestablecer(() => emit('cerrar-modal'))

    onConsultado((entidad) => {accion.value = acciones.consultar
        setTimeout(async () => {
        await refArchivo.value.listarArchivosAlmacenados(entidad.id)
      }, 1)}
    );

    /*******
     * Init
     *******/



    fichaAptitud.registro_empleado_examen =
      medicoStore.idRegistroEmpleadoExamen ?? null
    fichaAptitud.profesional_salud = authenticationStore.user.id
    if (medicoStore.idFichaAptitud)
      consultar({ id: medicoStore.idFichaAptitud })

    const subirFichaMedicaFirmada = async () => {
      await refArchivo.value.subir()
    }
    const quieroSubirArchivos = computed(
      () => refArchivo.value?.quiero_subir_archivos
    )

    return {
      mixin,
      listadosAuxiliares,
      accion,
      acciones,
      refArchivo,
      subirFichaMedicaFirmada,
      quieroSubirArchivos,
      fichaAptitud,
      tiposEvaluacionesMedicasRetiros,
      descargarPdf,
      firmarPaciente,
      disabled,
      mostrarDescargarPdf: authenticationStore.esMedico,
      mostrarFirmarPaciente: computed(
        () => fichaAptitud.paciente === authenticationStore.user.id
      )
    }
  }
})
