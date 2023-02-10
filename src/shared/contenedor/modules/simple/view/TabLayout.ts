// Dependencias
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Componentes
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { useAuthenticationStore } from 'stores/authentication'
import { acciones } from 'config/utils'

export default defineComponent({
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<EntidadAuditable>,
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
    accion1: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    full: {
      type: Boolean,
      default: false,
    }
  },
  components: { EssentialTable, ButtonSubmits },
  setup(props) {
    const { listar, guardar, editar, eliminar, consultar, reestablecer } =
      props.mixin.useComportamiento()

    const { entidad, listado, accion, filtros, tabs, nextPageUrl } =
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
        style: 'width:200px'
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

    const nombre = Router.currentRoute.value.name?.toString().replaceAll('_', ' ') ?? ''
    const tituloTabla = nombre.toLowerCase().substring(0, 1).toUpperCase() + nombre.toLowerCase().substring(1, nombre.length)

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

    const router = useRoute()
    const store = useAuthenticationStore()

    const puedeVer = computed(() =>
      store.can(`puede.ver.${router.name?.toString()}`) && props.permitirConsultar
    )
    const puedeCrear = computed(() =>
      store.can(`puede.crear.${router.name?.toString()}`)
    )
    const puedeEditar = computed(() =>
      store.can(`puede.editar.${router.name?.toString()}`) && props.permitirEditar
    )
    const puedeEliminar = computed(() =>
      store.can(`puede.eliminar.${router.name?.toString()}`) && props.permitirEliminar
    )

    function cargarListado() {
      if (nextPageUrl.value)
        listar()
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
      accionTabla,
      // tituloPagina: tituloTabla[0].toUpperCase() + tituloTabla.substring(1),
      seleccionado,
      columnas,
      // acciones tabla
      consultar,
      editar,
      eliminar,
      puedeVer,
      puedeCrear,
      puedeEditar,
      puedeEliminar,
      cargarListado,

      //acciones personalizadas
      // accion1: props.accion1
    }
  },
})
