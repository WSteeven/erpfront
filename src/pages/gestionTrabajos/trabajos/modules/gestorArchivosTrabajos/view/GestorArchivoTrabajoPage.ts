// Dependencias
import { configuracionColumnasArchivoTrabajo } from '../domain/configuracionColumnasArchivoTrabajo'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { descargarArchivoUrl, formatBytes } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { AxiosError, AxiosResponse } from 'axios'
import { apiConfig, endpoints } from 'config/api'
import { accionesTabla } from 'config/utils'
import { defineComponent, ref } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ArchivoTrabajoController } from '../infraestructure/ArchivoTrabajoController'
import { Archivo } from '../domain/Archivo'
import { useSubtareaStore } from 'stores/subtarea'

export default defineComponent({
  components: {
    EssentialTable
  },
  setup() {
    /*********
     * Stores
     *********/
    const subtareaStore = useSubtareaStore()

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(Archivo, new ArchivoTrabajoController())
    const { entidad: archivo, listado } = mixin.useReferencias()
    const { editar, eliminar, listar } = mixin.useComportamiento()

    const { prompt, notificarCorrecto, notificarError } = useNotificaciones()

    listar({ trabajo_id: subtareaStore.idSubtareaSeleccionada })

    /***************
    * Botones tabla
    ***************/
    const btnEliminar: CustomActionTable = {
      titulo: 'Eliminar',
      icono: 'bi-trash3',
      color: 'negative',
      accion: async ({ entidad, posicion }) => {
        await eliminar(entidad, () =>
          listado.value.splice(posicion, 1)
        )
      }
    }

    const btnComentar: CustomActionTable = {
      titulo: 'Comentar',
      icono: 'bi-chat-square-text',
      color: 'primary',
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

    const btnDescargar: CustomActionTable = {
      titulo: 'Descargar',
      icono: 'bi-download',
      color: 'positive',
      accion: ({ entidad }) => descargarArchivoUrl(entidad.ruta)
    }

    const refGestor = ref()
    const axios = AxiosHttpRepository.getInstance()

    const ruta = `${apiConfig.URL_BASE}/${axios.getEndpoint(endpoints.archivos_trabajos)}`

    /************
    * Funciones
    *************/
    const quiero_subir_archivos = ref(false)

    async function factoryFn(files) {
      const fd = new FormData()
      fd.append('file', files[0])
      fd.append('trabajo_id', subtareaStore.idSubtareaSeleccionada)

      try {
        const response: AxiosResponse = await axios.post(ruta, fd)
        /*refGestor.value.reset()
        refGestor.value.removeUploadedFiles()
        refGestor.value.removeQueuedFiles()*/
        quiero_subir_archivos.value = false
        files.value = []
        listado.value.push(response.data.modelo)
        notificarCorrecto(response.data.mensaje)
      } catch (error: unknown) {
        const axiosError = error as AxiosError
        notificarError(axiosError.response?.data.mensaje)
      }
    }

    return {
      listado,
      refGestor,
      extraerExtension: (nombre: string) => nombre.split('.').at(-1),
      formatBytes,
      quiero_subir_archivos,
      columnas: [...configuracionColumnasArchivoTrabajo, accionesTabla],
      codigoTrabajoSeleccionado: subtareaStore.codigoTrabajoSeleccionado,
      btnEliminar,
      btnComentar,
      btnDescargar,
      factoryFn,
    }
  }
})
