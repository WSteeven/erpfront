// Dependencias
import { configuracionColumnasCampos } from '../domain/configuracionColumnasCampos'
import { Ref, defineComponent, ref } from 'vue'

// Componentes
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ArchivoController } from 'gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { ConfiguracionExamenCategoriaController } from '../infraestructure/ConfiguracionExamenCategoriaController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ConfiguracionExamenCampoController } from '../infraestructure/ConfiguracionExamenCampoController'
import { ResultadoExamenController } from '../infraestructure/ResultadoExamenController'
import { ResultadoExamen } from '../domain/ResultadoExamen'
import { useMedicoStore } from 'stores/medico'
import { ConfiguracionExamenCategorias } from '../domain/ConfiguracionExamenCategorias'

export default defineComponent({
  components: { EssentialTable, GestorArchivos },
  setup() {
    /*********
     * Stores
     ********/
    const medicoStore = useMedicoStore()

    const configuracionExamenCategoriaController = new ConfiguracionExamenCategoriaController()
    const configuracionExamenCampoController = new ConfiguracionExamenCampoController()

    const mixin = new ContenedorSimpleMixin(ResultadoExamen, new ResultadoExamenController(), new ArchivoController())

    const categoria: Ref<ConfiguracionExamenCategorias | undefined> = ref()
    const campos = ref([])
    const observacion = ref()

    const refArchivo = ref()
    const idTransferencia = ref()

    const consultarCategoria = async () => {
      const { result } = await configuracionExamenCategoriaController.listar({ examen_id: medicoStore.examen?.id })
      categoria.value = result[0]
    }

    const consultarCampos = async () => {
      const { result } = await configuracionExamenCampoController.listar({ configuracion_examen_categoria_id: 1 })
      campos.value = result
    }

    /*******
     * Init
     *******/
    consultarCategoria()
    consultarCampos()

    return {
      mixin,
      refArchivo,
      idTransferencia,
      consultarCategoria,
      consultarCampos,
      categoria,
      campos,
      configuracionColumnasCampos,
      observacion,
    }
  }
})
