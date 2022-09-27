// Dependencias
import { defineComponent, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

// Componentes
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { acciones } from 'config/utils'

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
    permitirConsultar: {
      type: Boolean,
      default: true,
    },
    permitirEditar: {
      type: Boolean,
      default: true,
    },
    permitirEliminar: {
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
    let listadoCargado = false

    const columnas = [
      ...props.configuracionColumnas,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    if (!listadoCargado) {
      listar()
      listadoCargado = true
    }

    const seleccionado = ref()

    watchEffect(() => {
      tabs.value = props.mostrarFormulario ? 'formulario' : 'listado'
    })

    const tituloTabla =
      Router.currentRoute.value.name?.toString().toLowerCase() ?? ''

    const accionTabla = {
      consultar: ({ entidad }) => {
        accion.value = acciones.consultar
        consultar(entidad)
      },
      editar: ({ entidad }) => {
        accion.value = acciones.editar
        consultar(entidad)
      },
      eliminar: ({ entidad }) => {
        accion.value = acciones.eliminar
        consultar(entidad)
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