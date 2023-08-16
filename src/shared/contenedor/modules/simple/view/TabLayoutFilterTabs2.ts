// Dependencias
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Componentes
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { useAuthenticationStore } from 'stores/authentication'
import { TabOption } from 'components/tables/domain/TabOption'
import { acciones } from 'config/utils'
import { useCargandoStore } from 'stores/cargando'

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
    subtituloPagina: {
      type: String,
      default: 'JPCONSTRUCRED',
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
    tabDefecto: String,
    full: {
      type: Boolean,
      default: false,
    },
    labelGuardar: {
      type: String,
      default: 'Guardar',
    },
    accion1: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion2: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion3: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion4: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion5: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion6: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion7: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion8: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion1Header: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion2Header: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion3Header: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accionButtonSubmit: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    filtrar: {
      type: Function,
      required: true,
    },
    forzarListar: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['tab-seleccionado'],
  components: { EssentialTableTabs, ButtonSubmits },
  setup(props, { emit }) {
    const { listar, guardar, editar, eliminar, consultar, reestablecer } =
      props.mixin.useComportamiento()

    const { entidad, listado, accion, filtros, tabs, nextPageUrl } =
      props.mixin.useReferencias()

    const Router = useRouter()
    // let listadoCargado = false

    const accionPersonalizada = computed(() => props.accion1)
    // console.log('accion recibida:',accionPersonalizada)

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

    // if (!listadoCargado) {
    // listar()
    // listadoCargado = true
    // }
    // const tabSeleccionado = 'TODO'
    aplicarFiltro(props.tabDefecto)

    function forzarListar() {
      if (props.forzarListar) aplicarFiltro(props.tabDefecto)
    }

    function aplicarFiltro(tabSeleccionado?) {
      props.filtrar(tabSeleccionado)
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
      store.can(`puede.eliminar.${router.name?.toString()}`) && props.permitirEliminar
    )

    const esBodeguero = store.esBodeguero
    const esCoordinador = store.esCoordinador

    // console.log(esCoordinador, ' - ', esBodeguero)

    /*function cargarListado() {
      if (nextPageUrl.value)
        listar({ estado: tabSeleccionado })
    }*/

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
      aplicarFiltro,
      accionPersonalizada,
      esBodeguero,
      esCoordinador,
      forzarListar,
      //valor del essentialLoading
      storeCargando: useCargandoStore(),
    }
  },
})
