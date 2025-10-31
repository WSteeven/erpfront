/**
 * @author Wilson Cordova
 * @description Este componente trabaja con la tabla archivos y es polimorfica para otros modelos
 * A nivel de backend hacer los métodos correspondientes en el controlador y la relación en el modelo.
 *
 */
// Dependencias
import {
  configuracionColumnasArchivoSubtarea
} from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/configuracionColumnasArchivoSubtarea'
import {CustomActionTable} from 'components/tables/domain/CustomActionTable'
import {descargarArchivoUrl} from 'shared/utils'
import {useNotificaciones} from 'shared/notificaciones'
import {AxiosError, AxiosResponse} from 'axios'
import {accionesTabla} from 'config/utils'
import {defineComponent, onBeforeUnmount, onMounted, ref} from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import {ContenedorSimpleMixin} from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import {ParamsType} from 'config/types'
import {useRejectedFiles} from '../../composables/useRejectedFiles'

export default defineComponent({
  components: {
    EssentialTable
  },
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<any>,
      required: true
    },
    permitirEliminar: {
      type: Boolean,
      default: true
    },
    listarAlGuardar: {
      type: Boolean,
      default: true
    },
    disable: {
      type: Boolean,
      default: false
    },
    permitirSubir: {
      type: Boolean,
      default: true
    },
    quieroSubirArchivos: {
      type: Boolean,
      default: false
    },
    idModelo: {
      type: Number,
      required: false
    },
    label: {
      type: String,
      required: false
    },
    formato: {
      type: String,
      default: '*'
    },
    maxFiles: {
      type: Number,
      default: 15 // **NOTA** :  valor temporal, actualizar a 1 cuando ya se controle el maximo de archivos en los componentes que llaman a GestorArchivos
    },
    maxTamanioBytes: {
      type: Number,
      default: 10485760 //10 MB
    }
  },
  emits: ['inicializado'],
  setup(props, { emit }) {
    /********
     * Mixin
     *********/
    const { listadoArchivos, entidad } = props.mixin.useReferencias()
    const { eliminarArchivo, listarArchivos, guardarArchivos } =
      props.mixin.useComportamiento()

    const {
      notificarError,
      confirmar
    } = useNotificaciones()

    async function listarArchivosAlmacenados(id: number, params: string) {
      //ParamsType) {
      await listarArchivos(id, params)
    }

    const cantElementos = ref(0)
    const tamanioListado = ref(0)
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
          () => eliminarArchivo(entidad)
        )
        entidad.isComponentFilesModified = true
      }
    }

    const btnDescargar: CustomActionTable = {
      titulo: 'Ver/Descargar',
      icono: 'bi-eye',
      color: 'positive',
      accion: ({ entidad }) => {
        descargarArchivoUrl(entidad.ruta)
      }
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

    onMounted(() => {
      emit('inicializado')


      document.addEventListener('paste', handlePaste)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('paste', handlePaste)
    })
    /************
     * Funciones
     *************/
    const quiero_subir_archivos = ref(props.quieroSubirArchivos)

    async function factoryFn(files) {
      const fd = new FormData()
      fd.append('file', files[0])

      for (const key in paramsForm) {
        fd.append(key, paramsForm[key])
      }

      try {
        const response: AxiosResponse = await guardarArchivos(
          props.idModelo!,
          fd
        )

        files.value = []
        if (props.listarAlGuardar)
          listadoArchivos.value.push(response.data.modelo)
        // notificarCorrecto(response.data.mensaje)
        quiero_subir_archivos.value = false
      } catch (error: unknown) {
        const axiosError = error as AxiosError
        notificarError(axiosError.response?.data?.message ?? 'error')
      }
    }

    async function subir(params: ParamsType) {
      // console.log('subiendo...')
      paramsForm = params
      if (refGestor.value) {
        await refGestor.value.upload()
        await refGestor.value.reset()
        await refGestor.value.removeUploadedFiles()
        await refGestor.value.removeQueuedFiles()
      }
    }

    const { onRejected } = useRejectedFiles(props)

    function limpiarListado() {
      listadoArchivos.value = []
    }

    function onFileAdded(files) {
      for (let index = 0; index < files.length; index++) {
        cantElementos.value += 1
      }
      tamanioListado.value += obtenerSumatoriaTamanio(files)
      // props.mixin.useReferencias().
      entidad.isComponentFilesModified = true
    }

    function onFileRemoved(file) {
      cantElementos.value -= 1
      tamanioListado.value -= obtenerSumatoriaTamanio(file)
      entidad.isComponentFilesModified = true
    }

    function obtenerSumatoriaTamanio(files) {
      return files.reduce((total, file) => total + file.size, 0)
    }

    function bytesToMB(bytes) {
      if (bytes === 0) return '0 MB'

      const megabytes = bytes / (1024 * 1024)
      return megabytes.toFixed(2) + ' MB'
    }

    return {
      listadoArchivos,
      refGestor,
      dropZone,
      isHovering,
      hasFocus,
      quiero_subir_archivos,
      columnas: [...configuracionColumnasArchivoSubtarea, accionesTabla],
      onRejected,
      btnEliminar,
      btnDescargar,
      onFileAdded,
      onFileRemoved,
      tamanioListado,
      cantElementos,
      factoryFn,
      subir,
      limpiarListado,
      listarArchivosAlmacenados,
      bytesToMB
    }
  }
})
