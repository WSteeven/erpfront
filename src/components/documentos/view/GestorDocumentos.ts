// Dependencias
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { descargarArchivoUrl, formatBytes } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { AxiosError, AxiosResponse } from 'axios'
import { accionesTabla } from 'config/utils'
import { defineComponent, ref, watchEffect } from 'vue'
import { apiConfig } from 'config/api'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { ParamsType } from 'config/types'
import { configuracionColumnasDocumento } from '../domain/configuracionColumnasDocumento'

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
    },
    mostrarListado: {
      type: Boolean,
      default: true,
    },
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

    const ruta = `${apiConfig.URL_BASE}/${axios.getEndpoint(props.endpoint)}`

    /************
     * Funciones
     *************/
    const quiero_subir_archivos = ref(false)
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

        // Restablecer el componente q-uploader para mostrar el botón de "añadir archivos" nuevamente
        refGestor.value.reset()

      } catch (error: unknown) {
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
    }
    function onFileRemoved(file) {
      tamanioListado.value -= obtenerSumatoriaTamanio(file)
    }
    function obtenerSumatoriaTamanio(files) {
      const sumatoria = files.reduce((total, file) => total + file.size, 0)
      return sumatoria
    }
    function limpiarListado() {
      listado.value = []
    }
    watchEffect(() => (quiero_subir_archivos.value = props.esObligatorio))
    return {
      listado,
      refGestor,
      extraerExtension: (nombre: string) => nombre.split('.').at(-1),
      formatBytes,
      onFileAdded,
      onFileRemoved,
      watchEffect,
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
    }
  },
})
