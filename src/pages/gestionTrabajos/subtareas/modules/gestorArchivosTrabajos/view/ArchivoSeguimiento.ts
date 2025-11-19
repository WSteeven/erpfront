// Dependencias
import { configuracionColumnasArchivoSubtarea } from '../domain/configuracionColumnasArchivoSubtarea'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { descargarArchivoUrl, formatBytes } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { AxiosError, AxiosResponse } from 'axios'
import { accionesTabla } from 'config/utils'
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { apiConfig } from 'config/api'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { useSubtareaStore } from 'stores/subtarea'
import { ParamsType } from 'config/types'
import { isDuplicate } from 'src/composables/useRejectedFiles'

export default defineComponent({
  components: {
    EssentialTable
  },
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<any>,
      required: true
    },
    endpoint: {
      type: Object as () => Endpoint,
      required: true
    },
    entidad: Object as () => EntidadAuditable,
    disable: {
      type: Boolean,
      default: false
    },
    permitirEliminar: {
      type: Boolean,
      default: true
    },
    listarAlGuardar: {
      type: Boolean,
      default: true
    },
    permitirSubir: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: 'Quiero compartir archivos'
    },
    multiple: {
      type: Boolean,
      default: true
    }
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

    const {
      notificarCorrecto,
      notificarError,
      notificarAdvertencia,
      confirmar
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
      }
    }

    const btnDescargar: CustomActionTable = {
      titulo: 'Descargar',
      icono: 'bi-download',
      color: 'positive',
      accion: ({ entidad }) => descargarArchivoUrl(entidad.ruta)
    }

    const refGestor = ref()
    const dropZone = ref<HTMLElement>()
    const isHovering = ref(false)
    const hasFocus = ref(false)
    const handlePaste: (e: ClipboardEvent) => void = async e => {
      if (!isHovering.value && !hasFocus.value) return // 🔒 no pegar si no está sobre o enfocado

      const items = e.clipboardData?.items
      if (!items) return

      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file) {
            if(isDuplicate(refGestor, file)){
                notificarError(`El archivo ${file.name} ya está adjuntado.`)
                continue
            }
            refGestor.value.addFiles([file])
            // console.log('Archivo pegado:', file.name)
          }
          // if (file && file.type.startsWith('image/')) {
          //   // Agregar la imagen pegada al uploader
          //   refGestor.value.addFiles([file])
          //   console.log('Imagen pegada:', file.name)
          // }
        }
      }
    }
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
        if (props.listarAlGuardar) listado.value.push(response.data.modelo)
        notificarCorrecto(response.data.mensaje)
        quiero_subir_archivos.value = false
      } catch (error: unknown) {
        // console.log(error)
        const axiosError = error as AxiosError
        notificarError(axiosError.response?.data.mensaje)
      }
    }

    async function subir(params: ParamsType) {
      paramsForm = params
      if (refGestor.value) {
        await refGestor.value.upload()

        refGestor.value.reset()
        refGestor.value.removeUploadedFiles()
        refGestor.value.removeQueuedFiles()
      }
    }

    function onRejected(rejectedEntries) {
      rejectedEntries.forEach(element => {
        switch (element.failedPropValidation) {
          case 'duplicate':
            notificarError(`El archivo ${element.file.name} ya está adjuntado.`)
            break
          default:
            notificarAdvertencia(
              'El tamaño total de los archivos no deben exceder los 10mb.'
            )
        }
      })
    }

    function limpiarListado() {
      listado.value = []
      // console.log('limpiado...')
    }

    onMounted(() => {
      document.addEventListener('paste', handlePaste)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('paste', handlePaste)
    })

    return {
      listado,
      refGestor,
      dropZone,
      isHovering,
      hasFocus,
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
      limpiarListado
    }
  }
})
