// Dependencias
import { defineComponent, ref } from 'vue'

// Logica y controladores
import { ArchivoController } from 'gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import { configuracionColumnasCampos } from '../domain/configuracionColumnasCampos'
import { ConfiguracionExamenCategoriaController } from '../infraestructure/ConfiguracionExamenCategoriaController'
import { ConfiguracionExamenCampoController } from '../infraestructure/ConfiguracionExamenCampoController'
import { ResultadoExamenController } from '../infraestructure/ResultadoExamenController'
import { ResultadoExamen } from '../domain/ResultadoExamen'

export default defineComponent({
  components: { EssentialTable, GestorArchivos },
  setup() {
    const configuracionExamenCategoriaController = new ConfiguracionExamenCategoriaController()
    const configuracionExamenCampoController = new ConfiguracionExamenCampoController()

    const mixin = new ContenedorSimpleMixin(ResultadoExamen, new ResultadoExamenController(), new ArchivoController())

    const categoria = ref()
    const campos = ref([])
    const observacion = ref()

    const refArchivo = ref()
    const idTransferencia = ref()

    const consultarCategoria = async () => {
      const { result } = await configuracionExamenCategoriaController.consultar(1)
      categoria.value = result
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
