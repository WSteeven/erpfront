// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { configuracionColumnasCampos } from '../domain/configuracionColumnasCampos'
import { Ref, defineComponent, ref } from 'vue'
import { useMedicoStore } from 'stores/medico'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ArchivoController } from 'gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { ConfiguracionExamenCategoriaController } from '../infraestructure/ConfiguracionExamenCategoriaController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
// import { ResultadoExamenController } from '../infraestructure/DetalleResultadoExamenController'
import { ResultadoExamen } from '../domain/ResultadoExamen'
import { acciones } from 'config/utils'
import { DetalleResultadoExamen } from '../domain/DetalleResultadoExamen'
import { DetalleResultadoExamenController } from '../infraestructure/DetalleResultadoExamenController'

export default defineComponent({
  components: { TabLayout, EssentialTable, GestorArchivos },
  setup() {
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
    accion.value = acciones.nuevo

    // const categorias: Ref<any | undefined> = ref()
    const campos = ref([])
    const observacion = ref()

    const refArchivo = ref()
    const idTransferencia = ref()

    const consultarCategoria = async () => {
      try {
        cargando.activar()
        const { result } = await configuracionExamenCategoriaController.listar({ examen_id: medicoStore.examenSolicitado?.examen_id, con_campos: true })
        resultadoExamen.resultados_examenes = result
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    /*******
     * Init
     *******/
    consultarCategoria()

    return {
      mixin,
      refArchivo,
      idTransferencia,
      consultarCategoria,
      resultadoExamen,
      // categorias,
      campos,
      configuracionColumnasCampos,
      observacion,
      categoriaExamen: medicoStore.examenSolicitado?.categoria
    }
  }
})
