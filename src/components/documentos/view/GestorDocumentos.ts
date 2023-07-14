import { AxiosResponse, AxiosError } from "axios"
import { CustomActionTable } from "components/tables/domain/CustomActionTable"
import EssentialTable from "components/tables/view/EssentialTable.vue"
import { apiConfig } from "config/api"
import { ParamsType } from "config/types"
import { accionesTabla } from "config/utils"
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin"
import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"
import { Endpoint } from "shared/http/domain/Endpoint"
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository"
import { useNotificaciones } from "shared/notificaciones"
import { descargarArchivoUrl, formatBytes } from "shared/utils"
import { defineComponent, ref, computed } from "vue"
import { configuracionColumnasDocumento } from "../domain/configuracionColumnasDocumento"

export default defineComponent({
  components: {
    EssentialTable,
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
    listarAlGuardar: {
      type: Boolean,
      default: true,
    },
    permitirSubir: {
      type: Boolean,
      default: true,
    },
    esObligatorio: {
      type: Boolean,
      default: true,
    },
    esMultiple: {
      type: Boolean,
      default: true,
    }
  },
  setup(props) {
    /********
     * Mixin
     *********/
    const { listado } = props.mixin.useReferencias()
    const { eliminar, listar } = props.mixin.useComportamiento()

    const {
      notificarCorrecto,
      notificarError,
      notificarAdvertencia,
      confirmar,
    } = useNotificaciones()

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
        confirmar(
          'Esta operación es irreversible. El archivo se eliminará de forma instantánea.',
          () => eliminar(entidad)
        )
      },
    }

    const btnDescargar: CustomActionTable = {
      titulo: 'Descargar',
      icono: 'bi-download',
      color: 'secondary',
      accion: ({ entidad }) => descargarArchivoUrl(entidad.ruta),
    }

    const refGestor = ref()
    const axios = AxiosHttpRepository.getInstance()
    const tamanioListado = ref(0)
    const tieneArchivo = ref(false)

    const ruta = `${apiConfig.URL_BASE}/${axios.getEndpoint(props.endpoint)}`

    /************
     * Funciones
     *************/
    const quiero_subir_archivos = computed(() => {
      return props.esObligatorio
    })
    const esConsultado = ref(false)
    async function factoryFn(files) {
      const fd = new FormData()
      fd.append('file', files[0])

      for (const key in paramsForm) {
        fd.append(key, paramsForm[key])
      }

      try {
        const response: AxiosResponse = await axios.post(ruta, fd)
        files.value = []
        if (props.listarAlGuardar) listado.value.push(response.data.modelo)
        notificarCorrecto(response.data.mensaje)
      } catch (error: unknown) {
        console.log(error)
        const axiosError = error as AxiosError
        notificarError(axiosError.response?.data.mensaje)
      }
    }

    function subir(params: ParamsType) {
      paramsForm = params
      if (refGestor.value) {
        refGestor.value.upload()
        refGestor.value.reset()
        refGestor.value.removeUploadedFiles()
        refGestor.value.removeQueuedFiles()
      }
    }

    function onRejected(rejectedEntries) {
      notificarAdvertencia(
        'El tamaño total de los archivos no deben exceder los 10mb.'
      )
    }
    function onFileAdded(file) {
      tamanioListado.value += obtenerSumatoriaTamanio(file)
      tieneArchivo.value =  tamanioListado.value >0
    }
    function onFileRemoved(file) {
      tamanioListado.value -= obtenerSumatoriaTamanio(file)
      tieneArchivo.value =  tamanioListado.value >0

    }
    function obtenerSumatoriaTamanio(files) {
      const sumatoria = files.reduce((total, file) => total + file.size, 0)
      return sumatoria
    }
    function limpiarListado() {
      listado.value = []
    }

    return {
      listado,
      refGestor,
      extraerExtension: (nombre: string) => nombre.split('.').at(-1),
      formatBytes,
      onFileAdded,
      onFileRemoved,
      quiero_subir_archivos,
      esConsultado,
      columnas: [...configuracionColumnasDocumento, accionesTabla],
      onRejected,
      btnEliminar,
      btnDescargar,
      factoryFn,
      subir,
      listarArchivos,
      limpiarListado,
      tamanioListado,
      tieneArchivo,
    }
  },
})
