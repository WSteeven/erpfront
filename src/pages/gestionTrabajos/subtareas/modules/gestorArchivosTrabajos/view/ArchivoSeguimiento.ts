// Dependencias
import { configuracionColumnasArchivoSubtarea } from '../domain/configuracionColumnasArchivoSubtarea'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { descargarArchivoUrl, formatBytes } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { AxiosError, AxiosResponse } from 'axios'
import { accionesTabla } from 'config/utils'
import { defineComponent, ref } from 'vue'
import { apiConfig } from 'config/api'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { useSubtareaStore } from 'stores/subtarea'
import { ParamsType } from 'config/types'

export default defineComponent({
  components: {
    EssentialTable
  },
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<any>,
      required: true,
    },
    endpoint: {
      type: Object as () => Endpoint,
      required: true,
    },
    entidad: Object as () => EntidadAuditable,
    disable: {
      type: Boolean,
      default: false,
    },
    permitirEliminar: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    /*********
     * Stores
    *********/
    const subtareaStore = useSubtareaStore()

    /********
     * Mixin
    *********/
    const { listado } = props.mixin.useReferencias()
    const { eliminar, listar } = props.mixin.useComportamiento()

    const { notificarCorrecto, notificarError, notificarAdvertencia, confirmar } = useNotificaciones()

    function listarArchivos(params: ParamsType) {
      listar(params)
    }

    let paramsForm

    /***************
    * Botones tabla
    ***************/
    const btnEliminar: CustomActionTable = {
      titulo: 'Eliminar',
      icono: 'bi-trash3',
      color: 'negative',
      visible: () => props.permitirEliminar,
      accion: async ({ entidad }) => {
        confirmar('Esta operación es irreversible. El archivo se eliminará de forma instantánea.', () => eliminar(entidad))
      }
    }

    const btnDescargar: CustomActionTable = {
      titulo: 'Descargar',
      icono: 'bi-download',
      color: 'positive',
      accion: ({ entidad }) => descargarArchivoUrl(entidad.ruta)
    }

    const refGestor = ref()
    const axios = AxiosHttpRepository.getInstance()

    const ruta = `${apiConfig.URL_BASE}/${axios.getEndpoint(props.endpoint)}`

    /************
    * Funciones
    *************/
    const quiero_subir_archivos = ref(false)

    async function factoryFn(files) {
      const fd = new FormData()
      fd.append('file', files[0])

      for (let key in paramsForm) {
        fd.append(key, paramsForm[key])

      }

      try {
        const response: AxiosResponse = await axios.post(ruta, fd)
        files.value = []
        listado.value.push(response.data.modelo)
        notificarCorrecto(response.data.mensaje)
        refGestor.value.removeQueuedFiles()
      } catch (error: unknown) {
        const axiosError = error as AxiosError
        notificarError(axiosError.response?.data.mensaje)
      }
    }

    function subir(params: ParamsType) {
      paramsForm = params
      refGestor.value.upload()
    }

    function onRejected(rejectedEntries) {
      notificarAdvertencia('El tamaño total de los archivos no deben exceder los 10mb.')
    }

    function limpiarListado() {
      listado.value = []
    }

    return {
      listado,
      refGestor,
      extraerExtension: (nombre: string) => nombre.split('.').at(-1),
      formatBytes,
      quiero_subir_archivos,
      columnas: [...configuracionColumnasArchivoSubtarea, accionesTabla],
      codigoSubtareaSeleccionada: subtareaStore.codigoSubtareaSeleccionada,
      onRejected,
      btnEliminar,
      btnDescargar,
      factoryFn,
      subir,
      listarArchivos,
      limpiarListado,
    }
  }
})
