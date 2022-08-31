import { Tooltip } from 'bootstrap/dist/js/bootstrap.js'

import { defineComponent, reactive, UnwrapRef, ref, computed } from 'vue'
import ButtonSubmits from '@shared/componentes/buttonSubmits/view/buttonSubmits.vue'
import { ContenedorSimpleMixin } from '@/app/shared/contenedor/modules/simple/application/contenedorSimple.mixin'
import Listado from '@shared/componentes/tablas/listado.vue'
import ImportarExcel from '@componentes/modales/modules/importarExcel/ImportarExcel.vue'
import {
  ArgumentosMenu,
  ConfigTabla,
} from '@/app/shared/componentes/tablas/types'
import { tipoSeleccion } from '@config/aggrid.config'
import { acciones, iconos } from '@/@config/utils.config'
import { MenuItemDef } from 'ag-grid-community'
import { crearIconoHtml } from '@/app/shared/utils'
import router from '@/router'
import { ComportamientoModales } from '@/app/shared/componentes/modales/application/ComportamientoModales.application'

export default defineComponent({
  name: 'TabTransaccionesSimples',
  components: {
    ButtonSubmits,
    Listado,
    ImportarExcel,
  },
  directives: {
    tooltip: {
      mounted(el, binding) {
        new Tooltip(el, {
          title: binding.value,
          placement: binding.arg,
          trigger: 'hover',
        })
      },
    },
  },
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<any>,
      required: true,
    },
    mostrarModificar: {
      type: Boolean,
      required: false,
      default: false,
    },
    mostrarCancelar: {
      type: Boolean,
      required: false,
      default: true,
    },
    mostrarTabListado: {
      type: Boolean,
      required: false,
      default: true,
    },
    cbEliminar: {
      type: Function,
      required: false,
    },
    resetFormularioOnUpdate: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  setup(props) {
    // mixin
    const mixin: UnwrapRef<any> = reactive(props.mixin)
    const {
      listar,
      guardar,
      editar,
      eliminar,
      consultar,
      reestablecer,
      descargarListado,
      obtenerPlantilla,
      importarListado,
    } = mixin.useComportamiento()

    const { entidad, listado, accion, filtros, fields, refImportarExcel } =
      mixin.useReferencias()

    // Configuracion de tabs
    const tabIndex = ref(0)
    const mostrarFormulario = () => {
      tabIndex.value = 0
    }

    // Carga inicial de listado
    if (props.mostrarTabListado) {
      listar(filtros, false)
      tabIndex.value = 1
    }

    const obtenerMenu = function (params: ArgumentosMenu) {
      const items: (MenuItemDef | string)[] = []
      if (params.node) {
        const data = params.node.data
        // Consultar entidad
        items.push({
          name: 'Consultar',
          action: () => {
            accion.value = acciones.consultar
            consultar(data)
          },
          icon: crearIconoHtml(iconos.visualizar),
        })
        // Modificar entidad
        items.push({
          name: 'Modificar',
          action: () => {
            accion.value = acciones.modificar
            consultar(data)
          },
          icon: crearIconoHtml(iconos.modificar),
        })
        // Eliminar entidad
        items.push({
          name: 'Eliminar',
          action: () => {
            accion.value = acciones.eliminar
            consultar(data)
          },
          icon: crearIconoHtml(iconos.eliminar),
        })
        // --------  copia
        items.push('separator', 'copy')
      }
      return items
    }

    const configuracionTabla: ConfigTabla<any> = reactive({
      columnas: fields,
      obtenerMenu,
      /* configuracion_columnas: {
        estado: {
          customRender: ({data}: ICellRendererParams) => {
            const span = document.createElement("span")
            // tareaEstado false
            if (!data.estado) {
              const elemento = document.createElement("i")
              elemento.classList.add("feather", iconos.cancelar)
              span.appendChild(elemento)
            }
            return span
          },
        },
      }, */
    })

    const obtenerListadoFiltrado = () => {
      listar({ ...filtros }, false)
    }

    const configuracionPlantilla = obtenerPlantilla()

    return {
      // Referencias del mixin
      entidad,
      listado,
      accion,
      fields,
      filtros,
      refImportarExcel,
      // Comportamiento del mixin
      listar,
      guardar,
      editar,
      descargarListado,
      eliminar,
      reestablecer,
      importarListado,
      // Propiedades del componente
      configuracionTabla,
      tipoSeleccion,
      tabIndex,
      // Funciones del componente
      mostrarFormulario,
      obtenerListadoFiltrado,
      tituloTabla: router.currentRoute.value.name?.toString().toLowerCase(),
      mostrarImportarExcel: () => refImportarExcel.value.mostrar(),
      configuracionPlantilla,
    }
  },
})
