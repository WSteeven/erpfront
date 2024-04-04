import { computed, defineComponent, ref, watch, watchEffect } from 'vue'

// Componentes
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import { FichaAptitud } from '../domain/FichaAptitud'
import { FichaAptitudController } from '../infraestructure/FichaAptitudController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoEvaluacionMedicaRetiroController } from '../infraestructure/TipoEvaluacionMedicaRetiroController'
import { TipoAptitudMedicaLaboralController } from '../infraestructure/TipoAptitudMedicaLaboralController'
import { TipoEvaluacionMedicaRetiro } from '../domain/TipoEvaluacionMedicaRetiro'
import { useMedicoStore } from 'stores/medico'
import { useAuthenticationStore } from 'stores/authentication'
import { acciones } from 'config/utils'
import { OpcionRespuestaTipoEvaluacionMedicaRetiro } from '../domain/OpcionRespuestaTipoEvaluacionMedicaRetiro'

export default defineComponent({
  name: 'fichas_aptitudes',
  components: {
    SimpleLayout,
  },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const medicoStore = useMedicoStore()
    const authenticationStore = useAuthenticationStore()

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(FichaAptitud, new FichaAptitudController())
    const { entidad: fichaAptitud, accion, listadosAuxiliares, listado, disabled } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar, editarParcial, consultar } = mixin.useComportamiento()
    const { onBeforeGuardar, onReestablecer, onGuardado, onModificado, onConsultado, onListado } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        tiposEvaluacionesMedicasRetiros: new TipoEvaluacionMedicaRetiroController(),
        tiposAptitudesMedicasLaborales: new TipoAptitudMedicaLaboralController()
      })

      tiposEvaluacionesMedicasRetiros.value = listadosAuxiliares.tiposEvaluacionesMedicasRetiros.map((tipo: TipoEvaluacionMedicaRetiro, index: number) => {
        return {
          id: tipo.id,
          nombre: tipo.nombre,
          posibles_respuestas: respuestasTiposEvaluacionesMedicasRetiros[index],
          respuesta: null,
        }
      })

      watchEffect(() => {
        tiposEvaluacionesMedicasRetiros.value = tiposEvaluacionesMedicasRetiros.value?.map((tipo) => {
          const opcion: OpcionRespuestaTipoEvaluacionMedicaRetiro | undefined = fichaAptitud.opciones_respuestas_tipo_evaluacion_medica_retiro.find((opcion: OpcionRespuestaTipoEvaluacionMedicaRetiro) => opcion.tipo_evaluacion_medica_retiro === tipo.id)
          tipo.respuesta = opcion?.respuesta
          return tipo
        })

      })
    })
    

    /************
     * Variables
     ************/
    const respuestasTiposEvaluacionesMedicasRetiros = [
      ['SI', 'NO'],
      ['PRESUNTIVA', 'DEFINITIVA', 'NO APLICA'],
      ['SI', 'NO', 'NO APLICA'],
    ]
    const tiposEvaluacionesMedicasRetiros = ref()


    /************
     * Funciones
     ************/


    /********
     * Hooks
     ********/
    onBeforeGuardar(() => {
      fichaAptitud.opciones_respuestas_tipo_evaluacion_medica_retiro = tiposEvaluacionesMedicasRetiros.value.map((tipo: any) => {
        return {
          respuesta: tipo.respuesta,
          tipo_evaluacion_medica_retiro: tipo.id,
        }
      })
    })

    onReestablecer(() => emit('cerrar-modal'))

    onListado(() => {
      console.log('onlistado fuera de entidad...')
      const entidad = listado.value[0]
      if (entidad) {
        fichaAptitud.hydrate(entidad)
        accion.value = acciones.consultar

        console.log(entidad)

        console.log(fichaAptitud)
        fichaAptitud.opciones_respuestas_tipo_evaluacion_medica_retiro = entidad.opciones_respuestas_tipo_evaluacion_medica_retiro

        console.log('onlistadodentro de entidad...')

        /* watch(tiposEvaluacionesMedicasRetiros, () => {
          console.log('dentro de watch')
          console.log(fichaAptitud.opciones_respuestas_tipo_evaluacion_medica_retiro)
          console.log(tiposEvaluacionesMedicasRetiros.value)
          tiposEvaluacionesMedicasRetiros.value = tiposEvaluacionesMedicasRetiros.value?.map((tipo) => {
            const opcion: OpcionRespuestaTipoEvaluacionMedicaRetiro | undefined = fichaAptitud.opciones_respuestas_tipo_evaluacion_medica_retiro.find((opcion: OpcionRespuestaTipoEvaluacionMedicaRetiro) => opcion.tipo_evaluacion_medica_retiro === tipo.id)
            tipo.respuesta = opcion?.respuesta
            console.log(opcion)
            console.log(tipo)
            return tipo
          })

          console.log(tiposEvaluacionesMedicasRetiros.value)
        }, {flush: 'sync'}) */



        // fichaAptitud.opciones_respuestas_tipo_evaluacion_medica_retiro
        /*tiposEvaluacionesMedicasRetiros.value = listadosAuxiliares.tiposEvaluacionesMedicasRetiros.map((tipo: TipoEvaluacionMedicaRetiro, index: number) => {
          return {
            nombre: tipo.nombre,
            posibles_respuestas: respuestasTiposEvaluacionesMedicasRetiros[index],
            respuesta: null,
          }
        })*/
      }
    })

    /************
     * Observers
     ************/


    /*******
     * Init
     *******/
    fichaAptitud.registro_empleado_examen = medicoStore.idRegistroEmpleadoExamen ?? null
    fichaAptitud.profesional_salud = authenticationStore.user.id
    listar({ registro_empleado_examen_id: medicoStore.idRegistroEmpleadoExamen })

    // if (medicoStore.idFichaAptitud) consultar({ id: medicoStore.idFichaAptitud })

    return {
      mixin,
      listadosAuxiliares,
      fichaAptitud,
      tiposEvaluacionesMedicasRetiros,
    }
  }
})
