// Dependencias
import { configuracionColumnasTiposTrabajos } from '../domain/configuracionColumnasTiposTrabajos'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import {computed, defineComponent, onMounted, ref, watch} from 'vue'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { TipoTrabajoController } from '../infraestructure/TipoTrabajoController'
import { TipoTrabajo } from '../domain/TipoTrabajo'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { tabOptionsProveedoresInternacionales } from 'config/utils_compras_proveedores'
import {useRoute} from 'vue-router';
import FileComponent from 'components/documentos/view/FileComponent.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { acciones } from 'config/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  components: {
    TabLayoutFilterTabs2,
    ModalEntidad,
    FileComponent,
    ErrorComponent, ButtonSubmits,
    NoOptionComponent
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      TipoTrabajo,
      new TipoTrabajoController()
    )
    const {
      entidad: tipoTrabajo,
      disabled,
      accion,
      listadosAuxiliares, tabs
    } = mixin.useReferencias()
    const { cargarVista, obtenerListados, setValidador, listar,guardar, reestablecer, editar, eliminar } =
      mixin.useComportamiento()
      const  {onConsultado, onReestablecer, onBeforeGuardar, onBeforeModificar}=mixin.useHooks()

    const currentTab = ref('1')
    const route = useRoute()
    const searchTable = ref<string|string[]|null>(null)

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController()
      })
      clientes.value = listadosAuxiliares.clientes
    })

    const rules = {
      cliente: { required },
      url_plantilla: { required },
      descripcion: { required }
    }

    useNotificacionStore().setQuasar(useQuasar())
const cargando = new StatusEssentialLoading()
    const v$ = useVuelidate(rules, tipoTrabajo
    )
    setValidador(v$.value)

    const metodo = computed(() => {
      switch (accion.value) {
        case acciones.nuevo:
          return 'POST'
        case acciones.editar:
          return 'PUT'
        case acciones.eliminar:
          return 'DELETE'
        default:
          return 'GET'
      }
    })
    onBeforeGuardar(()=> tipoTrabajo._method=metodo.value)
    onBeforeModificar(()=> tipoTrabajo._method=metodo.value)
    onReestablecer(()=> tipoTrabajo._method=metodo.value)
    // Filtro clientes principales
    const clientes = ref()

    function filtrarClientes(val, update) {
      if (val === '') {
        update(() => {
          clientes.value = listadosAuxiliares.clientes
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        clientes.value = listadosAuxiliares.clientes.filter(
          v => v.razon_social.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    async function filtrarTiposTrabajos(tab: string) {
      currentTab.value = tab
      listar({ activo: tab })
    }

    /*************
     * HOOKS
     ************/
    onMounted(()=>{
      if(route.query.mainTab)tabs.value = route.query.mainTab as string
      if(route.query.tab) currentTab.value = route.query.tab as string
      if(route.query.searchTable) searchTable.value = route.query.searchTable
    })

// ejemplo: http://localhost:8080/tipos-trabajos?mainTab=listado&tab=1&searchTable=conecel
    watch(()=>route.query, (q)=>{
      if(q.mainTab)tabs.value = route.query.mainTab as string
      if(q.tab) currentTab.value = route.query.tab as string
      if(q.searchTable) searchTable.value = route.query.searchTable
    })

    /********************
     * BOTONES DE TABLA
     *******************/


    return {
      // mixin
      mixin,
      tipoTrabajo,
      disabled,
      accion,
      v$,
      configuracionColumnasTiposTrabajos,
      filtrarClientes,
      clientes,
      tabOptions: tabOptionsProveedoresInternacionales,
      currentTab,cargando,
      filtrarTiposTrabajos,searchTable,
      guardar, reestablecer, editar, eliminar
    }
  }
})
