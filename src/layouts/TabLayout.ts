// Dependencias
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

// Componentes
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/contenedorSimple.mixin'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { acciones } from 'config/utils'
// import { useTareaStore } from 'stores/tarea'

export default defineComponent({
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<any>,
      required: true,
    },
    mostrarButtonSubmits: {
      type: Boolean,
      default: true,
    },
    configuracionColumnas: {
      type: Object as () => ColumnConfig<EntidadAuditable>[],
      required: true,
    },
    tituloPagina: {
      type: String,
    },
    mostrarFormulario: {
      type: Boolean,
      default: true,
    },
    mostrarListado: {
      type: Boolean,
      default: true,
    },
  },
  components: { EssentialTable, ButtonSubmits },
  setup(props) {
    const { listar, guardar, editar, eliminar, consultar, reestablecer } =
      props.mixin.useComportamiento()

    const { entidad, listado, accion, filtros, fields, tabs } =
      props.mixin.useReferencias()

    const Router = useRouter()
    // const tareaStore = useTareaStore()

    const columnas = [
      ...props.configuracionColumnas,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    listar()

    const seleccionado = ref()
    tabs.value = 'listado'

    const tituloTabla =
      Router.currentRoute.value.name?.toString().toLowerCase() ?? ''

    const accionTabla = {
      consultar: (data) => {
        accion.value = acciones.consultar
        consultar(data)
      },
      editar: (data) => {
        accion.value = acciones.editar
        consultar(data)
      },
      eliminar: (data) => {
        accion.value = acciones.eliminar
        consultar(data)
      },
    }

    return {
      tabs,
      tituloTabla,
      guardar,
      reestablecer,
      entidad,
      listado,
      accion,
      filtros,
      fields,
      accionTabla,
      // tituloPagina: tituloTabla[0].toUpperCase() + tituloTabla.substring(1),
      seleccionado,
      columnas,
      // acciones tabla
      consultar,
      editar,
      eliminar,
    }
  },
})
