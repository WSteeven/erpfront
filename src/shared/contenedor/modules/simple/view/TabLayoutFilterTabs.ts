// Dependencias
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Componentes
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { useAuthenticationStore } from 'stores/authentication'
import { acciones } from 'config/utils'
import { TabOption } from 'components/tables/domain/TabOption'
import { emit } from 'process'

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
    tabOptions: {
      type: Array as () => TabOption[],
      required: true,
    },
  },
  emits: ['tab-seleccionado'],
  components: { EssentialTableTabs, ButtonSubmits },
  setup(props, {emit}) {
    const { listar, guardar, editar, eliminar, consultar, reestablecer } =
      props.mixin.useComportamiento()

    const { entidad, listado, accion, filtros, fields, tabs, currentPageListado, nextPageUrl } =
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
        style: 'width:200px',
      },
    ]

    if (!listadoCargado) {
      listar({ page: currentPageListado.value, offset: 48 }, true)
      listadoCargado = true
    }
    let tabSeleccionado='TODO'

    function aplicarFiltro(tabSeleccionado) {
      listar({page: currentPageListado.value, offset: 48, estado: tabSeleccionado}, false)
      emit('tab-seleccionado', tabSeleccionado)
    }

    const seleccionado = ref()

    watchEffect(() => {
      tabs.value = props.mostrarFormulario ? 'formulario' : 'listado'
    })

    const nombre =
      Router.currentRoute.value.name?.toString().replaceAll('_', ' ') ?? ''
    const tituloTabla =
      nombre.toLowerCase().substring(0, 1).toUpperCase() +
      nombre.toLowerCase().substring(1, nombre.length)

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
      store.can(`puede.ver.${router.name?.toString()}`)
    )
    const puedeCrear = computed(() =>
      store.can(`puede.crear.${router.name?.toString()}`)
    )
    const puedeEditar = computed(() =>
      store.can(`puede.editar.${router.name?.toString()}`) && props.permitirEditar
    )
    const puedeEliminar = computed(() =>
      store.can(`puede.eliminar.${router.name?.toString()}`)
    )

    const esBodeguero = store.esBodeguero
    const esCoordinador = store.esCoordinador

    // console.log(esCoordinador, ' - ', esBodeguero)

    function cargarListado() {
      if (nextPageUrl.value)
        listar({ page: currentPageListado.value + 1, offset: 48, estado: tabSeleccionado }, true)
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
      puedeVer,
      puedeCrear,
      puedeEditar,
      puedeEliminar,
      aplicarFiltro,
      //cargar listado
      cargarListado,

      esBodeguero,
      esCoordinador,
    }
  },
})
