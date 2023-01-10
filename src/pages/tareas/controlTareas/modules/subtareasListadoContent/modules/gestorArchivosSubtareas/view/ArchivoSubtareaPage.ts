// Dependencias
import { configuracionColumnasArchivoSubtarea } from '../domain/configuracionColumnasArchivoSubtarea'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useSubtareaListadoStore } from 'stores/subtareaListado'
import { descargarArchivoUrl, formatBytes } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { apiConfig, endpoints } from 'config/api'
import { accionesTabla } from 'config/utils'
import { defineComponent, ref } from 'vue'
import { AxiosResponse } from 'axios'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ArchivoSubtareaController } from '../infraestructure/ArchivoSubtareaController'
import { Archivo } from '../domain/Archivo'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'


export default defineComponent({
  components: {
    EssentialTable
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Archivo, new ArchivoSubtareaController())
    const { entidad: archivo, listado } = mixin.useReferencias()
    const { editar, eliminar, listar } = mixin.useComportamiento()

    const { prompt, notificarCorrecto, notificarError } = useNotificaciones()
    const store = useSubtareaListadoStore()

    listar({ subtarea: store.idSubtareaSeleccionada })

    async function botonEliminar({ entidad }) {
      await eliminar(entidad, () =>
        listado.value.splice(store.posicionSubtareaSeleccionada, 1)
      )
    }

    const botonAgregarComentario: CustomActionTable = {
      titulo: 'Comentar',
      icono: 'bi-chat-square-text',
      color: 'secondary',
      accion: ({ entidad }) => {
        const config: CustomActionPrompt = {
          mensaje: 'Ingrese el comentario',
          defecto: entidad.comentario,
          accion: (data) => {
            entidad.comentario = data
            archivo.hydrate(entidad)
            editar(archivo)
          }
        }

        prompt(config)
      },
    }

    const botonDescargar: CustomActionTable = {
      titulo: 'Descargar',
      icono: 'bi-download',
      color: 'positive',
      accion: ({ entidad }) => descargarArchivoUrl(entidad.ruta)
    }

    const refGestor = ref()
    const axios = AxiosHttpRepository.getInstance()

    const ruta = `${apiConfig.URL_BALSE}/${axios.getEndpoint(endpoints.archivos_subtareas)}`

    async function factoryFn(files) {
      const fd = new FormData()
      fd.append('file', files[0])
      fd.append('subtarea', store.idSubtareaSeleccionada)
      // console.log(files)

      try {
        const response: AxiosResponse = await axios.post(ruta, fd)
        refGestor.value.reset()
        refGestor.value.removeUploadedFiles()
        refGestor.value.removeQueuedFiles()
        files.value = []
        listado.value.push(response.data.modelo) //, ...listado.value]
        notificarCorrecto(response.data.mensaje)
      } catch (error: any) {
        notificarError(error.response.data.mensaje)
      }
    }

    return {
      listado,
      refGestor,
      botonEliminar,
      extraerExtension: (nombre: string) => nombre.split('.').at(-1),
      formatBytes,
      quiero_subir_archivos: ref(false),
      columnas: [...configuracionColumnasArchivoSubtarea, accionesTabla],
      botonAgregarComentario,
      botonDescargar,
      factoryFn,
    }
  }
})
