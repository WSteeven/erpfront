// Dependencias
import { defineComponent, ref } from 'vue'
import { formatBytes } from 'shared/utils'
import { configuracionColumnasGestorArchivo } from '../domain/configuracionColumnasGestorArchivo'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { accionesTabla } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { useSubtareaListadoStore } from 'stores/subtareaListado'
import { apiConfig, endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'

export default defineComponent({
  components: {
    EssentialTable
  },
  setup() {
    const { prompt, notificarCorrecto, notificarError } = useNotificaciones()
    const store = useSubtareaListadoStore()

    const archivos = [
      {
        nombre: 'archivo 1.docx',
        tamanio_bytes: '16mb',
      },
      {
        nombre: 'Ruta asignada.kmz',
        tamanio_bytes: '12mb',
      }
    ]

    const botonAgregarComentario: CustomActionTable = {
      titulo: 'Agregar comentario',
      icono: 'bi-chat-square-text',
      color: 'secondary',
      accion: ({ entidad }) => {
        prompt(
          'Ingrese el comentario',
          (data) => entidad.comentario = data,
          entidad.comentario
        )
      },
    }

    const botonDescargar: CustomActionTable = {
      titulo: 'Descargar',
      icono: 'bi-download',
      color: 'positive',
      accion: ({ entidad }) => {
        prompt(
          'Ingrese el comentario',
          (data) => entidad.comentario = data,
          entidad.comentario
        )
      },
    }

    const refGestor = ref()
    const axios = AxiosHttpRepository.getInstance()

    const ruta = `${apiConfig.URL_BALSE}/${axios.getEndpoint(endpoints.subtareas)}subir-archivo`

    function factoryFn(files) {
      const fd = new FormData()
      fd.append('file', files[0])
      fd.append('subtarea', store.idSubtareaSeleccionada)

      axios
        .post(ruta, fd)
        .then((response: any) => {
          refGestor.value.reset()
          notificarCorrecto(response.data.mensaje)
        })
        .catch((error) => {
          notificarError(error.response.data.mensaje)
        })
    }

    return {
      refGestor,
      archivos,
      extraerExtension: (nombre: string) => nombre.split('.').at(-1),
      formatBytes,
      quiero_subir_archivos: ref(false),
      columnas: [...configuracionColumnasGestorArchivo, accionesTabla],
      botonAgregarComentario,
      botonDescargar,
      factoryFn,
    }
  }
})
