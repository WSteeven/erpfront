// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { configuracionColumnasCampos } from '../domain/configuracionColumnasCampos'
import { Ref, computed, defineComponent, ref, watchEffect } from 'vue'
import { useNotificaciones } from 'shared/notificaciones'
import { useMedicoStore } from 'stores/medico'
import { acciones } from 'config/utils'

// Componentes
import SimpleLayout from 'shared/contenedor/modules/simple/view/SimpleLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ArchivoController } from 'gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { SolicitudExamenController } from 'pages/medico/solicitudesExamenes/infraestructure/SolicitudExamenController'
import { ConfiguracionExamenCategoriaController } from '../infraestructure/ConfiguracionExamenCategoriaController'
import { ResultadoExamenController } from '../infraestructure/ResultadoExamenController'
import { SolicitudExamen } from 'pages/medico/solicitudesExamenes/domain/SolicitudExamen'
import { ConfiguracionExamenCampo } from '../domain/ConfiguracionExamenCampo'
import { ItemExamenCategorias } from '../domain/ItemExamenCategorias'
import { ResultadoExamen } from '../domain/ResultadoExamen'
import { ItemExamen } from '../domain/ItemExamen'

export default defineComponent({
  name: 'resultados_examenes',
  components: { SimpleLayout, EssentialTable },
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    /*********
     * Stores
     ********/
    const medicoStore = useMedicoStore()

    /************
     * Variables
     ************/
    const cargando = new StatusEssentialLoading()
    const itemsExamenes: Ref<ItemExamen[]> = ref([])
    const resultadosExamenes: Ref<ResultadoExamen[]> = ref([])
    const observacion = ref()
    const refArchivo = ref()
    const idTransferencia = ref()
    const { notificarCorrecto } = useNotificaciones()

    /*************
     * Controller
    *************/
    const configuracionExamenCategoriaController = new ConfiguracionExamenCategoriaController()
    const resultadoExamenController = new ResultadoExamenController()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(SolicitudExamen, new SolicitudExamenController(), new ArchivoController())
    const { onGuardado, onModificado, onBeforeGuardar, onBeforeModificar, onReestablecer } = mixin.useHooks()
    const { entidad: solicitudExamen, accion } = mixin.useReferencias()
    const { consultar } = mixin.useComportamiento()

    /************
     * Funciones
     ************/
    const consultarCategoriasCampos = async () => {
      try {
        cargando.activar()
        const { result } = await configuracionExamenCategoriaController.listar({ registro_empleado_examen_id: medicoStore.idRegistroEmpleadoExamen })
        itemsExamenes.value = result
        console.log(itemsExamenes.value)
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    const consultarResultadosExamenes = async () => {
      try {
        cargando.activar()
        const { result } = await resultadoExamenController.listar({ registro_empleado_examen_id: medicoStore.idRegistroEmpleadoExamen })
        resultadosExamenes.value = result
        console.log(resultadosExamenes.value)
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    const completarCamposLlenos = async () => {
      itemsExamenes.value.map((itemExamen: ItemExamen) => {
        console.log(itemExamen)

        return itemExamen.categorias.map((itemExamenCategoria: ItemExamenCategorias) => {
          return itemExamenCategoria.campos.map((campo: ConfiguracionExamenCampo) => {
            const resultadoExamen = resultadosExamenes.value.find((res: ResultadoExamen) => res.examen_solicitado === itemExamen.examen_solicitado && res.configuracion_examen_campo === campo.id)
            campo.resultado_examen = resultadoExamen?.id ?? null
            campo.resultado = resultadoExamen?.resultado ?? null
            campo.observaciones = resultadoExamen?.observaciones ?? null
            console.log(resultadosExamenes.value)
            console.log(campo)
            return campo
          })
        })
      })

      accion.value = acciones.editar
    }



    /********
     * Hooks
     ********/
    const stop = watchEffect(() => {
      if (itemsExamenes.value.length) {
        completarCamposLlenos()
        /*setTimeout(() => {
          refArchivo.value.listarArchivosAlmacenados(solicitudExamen.id)
        }, 1)*/
        stop()
      }
    })

    const guardarResultadosExamenes = async () => {
      resultadosExamenes.value = []

      itemsExamenes.value.forEach((item: ItemExamen) => {
        item.categorias.forEach((itemExamenCategoria: ItemExamenCategorias) => {
          itemExamenCategoria.campos.forEach((campo: ConfiguracionExamenCampo) => {
            console.log(campo)

            if (campo.resultado) {
              const resultado = new ResultadoExamen()
              resultado.resultado = campo.resultado
              resultado.configuracion_examen_campo = campo.id
              resultado.observaciones = campo.observaciones
              resultado.examen_solicitado = item.examen_solicitado
              resultadosExamenes.value.push(resultado)
            }
          })
        })
      })

      try {
        const { response } = await resultadoExamenController.guardarListado(resultadosExamenes.value)
        notificarCorrecto(response.data.mensaje)
      } catch (e) {
        console.log(e)
      }

      emit('cerrar-modal')
    }

    const editarResultadosExamenes = async () => {
      resultadosExamenes.value = []

      console.log(itemsExamenes.value)

      itemsExamenes.value.forEach((item: ItemExamen) => {
        item.categorias.forEach((itemExamenCategoria: ItemExamenCategorias) => {
          itemExamenCategoria.campos.forEach((campo: ConfiguracionExamenCampo) => {
            console.log(campo)

            if (campo.resultado) {
              const resultado = new ResultadoExamen()
              resultado.id = campo.resultado_examen
              resultado.resultado = campo.resultado
              resultado.configuracion_examen_campo = campo.id
              resultado.observaciones = campo.observaciones
              resultado.examen_solicitado = item.examen_solicitado
              resultadosExamenes.value.push(resultado)
            }
          })
        })
      })

      try {
        const { response } = await resultadoExamenController.editarListado(resultadosExamenes.value)
        notificarCorrecto(response.data.mensaje)
      } catch (e) {
        console.log(e)
      }

      emit('cerrar-modal')
    }

    /********
     * Hooks
     ********/
    onReestablecer(() => emit('cerrar-modal'))

    /*******
     * Init
     *******/
    consultarCategoriasCampos()
    consultarResultadosExamenes()

    return {
      mixin,
      // resultadoExamen,
      itemsExamenes,
      refArchivo,
      idTransferencia,
      resultadosExamenes,
      configuracionColumnasCampos,
      observacion,
      accion,
      guardarResultadosExamenes,
      editarResultadosExamenes,
      mostrarGuardar: computed(() => accion.value === acciones.nuevo),
      mostrarEditar: computed(() => accion.value === acciones.editar),
    }
  }
})
