// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { configuracionColumnasCampos } from '../domain/configuracionColumnasCampos'
import { defineComponent, ref, watchEffect } from 'vue'
import { useMedicoStore } from 'stores/medico'
import { acciones } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ArchivoController } from 'gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { ConfiguracionExamenCategoriaController } from '../infraestructure/ConfiguracionExamenCategoriaController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { DetalleResultadoExamenController } from '../infraestructure/DetalleResultadoExamenController'
import { ConfiguracionExamenCampo } from '../domain/ConfiguracionExamenCampo'
import { DetalleResultadoExamen } from '../domain/DetalleResultadoExamen'
import { ResultadoExamen } from '../domain/ResultadoExamen'

export default defineComponent({
  components: { TabLayout, EssentialTable, GestorArchivos },
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    /*********
     * Stores
     ********/
    const medicoStore = useMedicoStore()

    /************
     * Variables
     ************/
    const configuracionExamenCategoriaController = new ConfiguracionExamenCategoriaController()
    const cargando = new StatusEssentialLoading()

    const mixin = new ContenedorSimpleMixin(DetalleResultadoExamen, new DetalleResultadoExamenController(), new ArchivoController())
    const { entidad: resultadoExamen, accion } = mixin.useReferencias()
    const { onGuardado, onModificado, onBeforeGuardar, onBeforeModificar } = mixin.useHooks()
    const { consultar } = mixin.useComportamiento()

    const resultadosExamenes = ref([])
    const observacion = ref()

    const refArchivo = ref()
    const idTransferencia = ref()

    const consultarCategoriasCampos = async () => {
      try {
        cargando.activar()
        const { result } = await configuracionExamenCategoriaController.listar({ examen_id: medicoStore.examenSolicitado?.examen_id })
        resultadosExamenes.value = result
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    const completarCamposLlenos = async () => {
      console.log('lleno en funcion... observer consultado')
      console.log('completarCamposLlenos....')
      console.log(resultadosExamenes.value)
      resultadosExamenes.value.map((item: any) => {
        console.log(item.campos)
        return item.campos.map((campo: ConfiguracionExamenCampo) => {
          console.log(resultadoExamen.resultados_examenes)
          console.log(campo)
          const campoEncontrado = resultadoExamen.resultados_examenes.find((re: ResultadoExamen) => re.configuracion_examen_campo === campo.id)
          console.log(campoEncontrado)
          if (campoEncontrado) {
            campo.resultado_examen = campoEncontrado.id
            campo.resultado = campoEncontrado.resultado
            console.log(campo)
            return campo
          }
        })
      })

      accion.value = acciones.editar
    }

    async function subirArchivos() {
      await refArchivo.value.subir()
      emit('cerrar-modal')
    }

    /********
     * Hooks
     ********/
    const stop = watchEffect(() => {
      if (resultadoExamen.resultados_examenes.length && resultadosExamenes.value.length) {
        completarCamposLlenos()
        setTimeout(() => {
          refArchivo.value.listarArchivosAlmacenados(resultadoExamen.id)
        }, 1);
        stop()
      }
    })

    onBeforeGuardar(() => {
      console.log(resultadosExamenes.value)
      resultadosExamenes.value.forEach((item: any) => {
        item.campos.forEach((campo: any) => {
          console.log(campo)

          if (campo.resultado) {

            const resultado = new ResultadoExamen()
            resultado.resultado = campo.resultado
            resultado.configuracion_examen_campo = campo.id
            resultadoExamen.resultados_examenes.push(resultado)
          }
        })
      })
    })

    onGuardado((id: number, responseData) => {
      idTransferencia.value = id
      const modelo: DetalleResultadoExamen = responseData.modelo
      emit('guardado', modelo.id)
      emit('cerrar-modal')
      setTimeout(() => {
        subirArchivos()
      }, 1)
    })

    onModificado((id: number) => {
      idTransferencia.value = id
      console.log('subiendo archivo actuaizado')
      setTimeout(async () => {
        await subirArchivos()
      }, 1)
    })

    onBeforeModificar(() => {
      resultadoExamen.resultados_examenes = []
      console.log(resultadosExamenes.value)
      resultadosExamenes.value.forEach((item: any) => {
        item.campos.forEach((campo: ConfiguracionExamenCampo) => {
          console.log(campo)

          if (campo.resultado) {

            const resultado = new ResultadoExamen()
            resultado.id = campo.resultado_examen
            resultado.resultado = campo.resultado
            resultado.configuracion_examen_campo = campo.id
            resultadoExamen.resultados_examenes.push(resultado)
          }
        })
      })
    })

    /*******
     * Init
     *******/
    consultarCategoriasCampos()
    if (medicoStore.examenSolicitado && medicoStore.examenSolicitado.detalle_resultado_examen) consultar({ id: medicoStore.examenSolicitado.detalle_resultado_examen })
    if (medicoStore.examenSolicitado) resultadoExamen.estado_solicitud_examen = medicoStore.examenSolicitado.id

    return {
      mixin,
      resultadoExamen,
      refArchivo,
      idTransferencia,
      resultadosExamenes,
      configuracionColumnasCampos,
      observacion,
      categoriaExamen: medicoStore.examenSolicitado?.categoria,
      examen: medicoStore.examenSolicitado?.examen,
    }
  }
})
