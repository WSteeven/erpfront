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
      default: 'SISTEMA',
    },
    mostrarFormulario: {
      type: Boolean,
      default: true,
    },
    mostrarListado: {
      type: Boolean,
      default: true,
    },
    permitirFiltrar: {
      type: Boolean,
      default: false,
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
    permitirCancelar: {
      type: Boolean,
      default: true,
    },
    puedeExportar: {
      type: Boolean,
      default: false,
    },
    tabOptions: {
      type: Array as () => TabOption[],
      required: false,
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
    labelEditar: {
      type: String,
      default: 'Guardar cambios',
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
    accion9: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion10: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion11: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion12: {
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
      required: false,
    },
    forzarListar: {
      type: Boolean,
      default: false,
    },
    ajustarCeldas: { //valor que se envia para que el contenido de la celda se autoaujuste al tamaño de la celda en lugar de aumentar su tamaño
      type: Boolean,
      default: false,
    },
    customPanel1: {
      type: Object,
      required: false,
    },
    customPanel2: {
      type: Object,
      required: false,
    },
    paginate: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['tab-seleccionado'],
  components: { EssentialTableTabs, ButtonSubmits },
  setup(props, { emit }) {
    /************
     * Variables
     ************/
    const { guardar, editar, eliminar, consultar, reestablecer } = props.mixin.useComportamiento()

    const { entidad, listado, accion, filtros, tabs } = props.mixin.useReferencias()

    const Router = useRouter()

    const accionPersonalizada = computed(() => props.accion1)

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

    const seleccionado = ref()

    const customPanel1Ejecutado = ref(false)
    const customPanel2Ejecutado = ref(false)

    const router = useRoute()
    const store = useAuthenticationStore()

    /************
     * Funciones
     ************/
    if (!props.forzarListar) aplicarFiltro(props.tabDefecto)

    function forzarListar() {
      if (props.forzarListar) aplicarFiltro(props.tabDefecto)
    }

    function aplicarFiltro(tabSeleccionado?) {
      props.filtrar ? props.filtrar(tabSeleccionado) : null
    }

    function ejecutarUnaVezCustomPanel1() {
      if (!customPanel1Ejecutado.value) props.customPanel1?.accion()
      customPanel1Ejecutado.value = true
    }

    function ejecutarUnaVezCustomPanel2() {
      if (!customPanel2Ejecutado.value) props.customPanel2?.accion()
      customPanel2Ejecutado.value = true
    }

    /************
    * Observers
    *************/
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
        console.log(accion.value)
      },
      eliminar: ({ entidad }) => {
        accion.value = acciones.eliminar
        consultar(entidad)
      },
    }

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

    const esBodeguero = store.esBodeguero
    const esCoordinador = store.esCoordinador

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
      seleccionado,
      columnas,
      tituloPagina: tituloTabla[0].toUpperCase() + tituloTabla.substring(1),
      // Acciones tabla
      consultar,
      editar,
      eliminar,
      forzarListar,
      puedeVer,
      puedeCrear,
      puedeEditar,
      puedeEliminar,
      aplicarFiltro,
      accionPersonalizada,
      esBodeguero,
      esCoordinador,
      // Valor del essentialLoading
      storeCargando: useCargandoStore(),
      // custom tab panel
      ejecutarUnaVezCustomPanel1,
      ejecutarUnaVezCustomPanel2,
    }
  },
})
