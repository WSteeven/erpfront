// Dependencias
import { defineComponent, ref } from 'vue'
import { formatBytes } from 'shared/utils'
import { configuracionColumnasGestorArchivo } from '../domain/configuracionColumnasGestorArchivo'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { accionesTabla } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
    components: {
        EssentialTable
    },
    setup() {
        const { prompt, notificarCorrecto } = useNotificaciones()

        const archivos = [
            {
                nombre: 'archivo 1.docx',
                tamanio_bytes: '16mb',
            },
            {
                nombre: 'Archivo KMZ 1.docx',
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

        return {
            archivos,
            extraerExtension: (nombre: string) => nombre.split(".").at(-1),
            formatBytes,
            quiero_subir_archivos: ref(false),
            columnas: [...configuracionColumnasGestorArchivo, accionesTabla],
            botonAgregarComentario,
            botonDescargar,
        }
    }
})