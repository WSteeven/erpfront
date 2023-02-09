// Dependencias
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  UnwrapRef,
} from 'vue'
import { columnaImportable } from '@shared/importable/domain/importable'
import { ColumnConfig, ConfigTabla } from '../../../tablas/types'
import { iconos } from '@config/utils.config'
import XLSX from 'xlsx'
// Componentes
import Listado from '@shared/componentes/tablas/listado.vue'
import { Modal } from 'bootstrap/dist/js/bootstrap.js'
import { Notificaciones } from '../../../toastification/application/notificaciones'

export default defineComponent({
  components: {
    Listado,
  },
  props: {
    configuracion: {
      type: Array as () => columnaImportable<any>[],
      required: true,
    },
  },
  emits: ['importar'],
  setup(props, { emit }) {
    const refImportarExcel = ref()
    const refFormulario = ref()
    const listado = ref<any>([])

    let modal: UnwrapRef<any>

    onMounted(() => (modal = new Modal(refImportarExcel.value)))
    const notificar = new Notificaciones()

    const mostrar = () => {
      const totalColumnasAMostrar = fields.length
      if (totalColumnasAMostrar) {
        modal.show()
      } else {
        notificar.notificarAdvertencia(
          'No se ha configurado los campos importables.'
        )
      }
    }

    const ocultar = () => {
      refFormulario.value.reset()
      modal.hide()
      limpiarlistado()
    }

    const limpiarlistado = () => listado.value.splice(0, listado.value.length)

    // 2) Configuracion de la plantilla
    const wsDefecto = XLSX.utils.aoa_to_sheet([]) // worksheet descargable
    const fields: ColumnConfig<any>[] = [] // campos de la tabla
    const obligatorios: string[] = [] // campos obligatorios
    const configuracionExcel = computed(() => props.configuracion)

    for (const config of configuracionExcel.value) {
      // si hay una columna configurada, en caso contrario ignorar
      if (config.columna) {
        // crear los fields de tabla
        fields.push({
          label: config.descripcion,
          field: config.field as string,
          editable: false,
          hide: false,
          type: config.type,
        })
        // agregar como campo a validar
        if (config.obligatorio) {
          obligatorios.push(config.field as string)
        }
        // elaborar plantilla de descarga
        XLSX.utils.sheet_add_aoa(wsDefecto, [[config.field as string]], {
          origin: `${config.columna}1`,
        })
      }
    }

    // 3) Configuracion de la tabla
    const configuracionTabla: ConfigTabla<any> = reactive({ columnas: fields })

    const procesarArchivo = function (event: any): void {
      const file = event.target.files[0]
      limpiarlistado()

      if (file) {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = function () {
          const contenido = reader.result
          if (contenido) {
            const wb = XLSX.read(new Uint8Array(contenido as ArrayBuffer), {
              type: 'array',
            })
            listado.value = [
              ...XLSX.utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]]),
            ]
          }
        }
      }
    }

    /**
     * Crea un libro de excel y descarga la hoja por defecto de la plantilla
     */
    function descargarPlantilla() {
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, wsDefecto, 'plantilla')
      XLSX.writeFile(wb, `plantilla.xlsx`)
    }

    /**
     * Emite el evento para que el controlador importe el listado obtenido
     */
    const emitEventImportar = () => {
      emit('importar', listado.value)
      ocultar()
    }

    return {
      iconos,
      // referencias
      refImportarExcel,
      refFormulario,
      // funciones
      ocultar,
      mostrar,
      // tabla
      configuracionTabla,
      listado,
      // editores
      procesarArchivo,
      descargarPlantilla,
      emitEventImportar,
    }
  },
})
