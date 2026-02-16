// Dependencias
import { configuracionColumnasTipoFotografias } from '../domain/configuracionColumnasTipoFotografias'
import {
  required,
  minLength,
  maxLength
} from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import {
  acciones
} from 'config/utils'
import {
  defineComponent,
  ref
} from 'vue'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import ErrorComponent from 'components/ErrorComponent.vue'

// Lógica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoFotografiaController } from '../infraestructure/TipoFotografiaController'
import { TipoFotografia } from '../domain/TipoFotografia'
import { useNotificaciones } from 'shared/notificaciones'
import { useAuthenticationStore } from 'stores/authentication'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { TipoTrabajoController } from 'gestionTrabajos/tiposTareas/infraestructure/TipoTrabajoController'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { tabOptionsProveedoresInternacionales } from 'config/utils_compras_proveedores'

export default defineComponent({
  components: {
    TabLayoutFilterTabs2,
    ErrorComponent,
    NoOptionComponent
  },
  setup() {
    const store = useAuthenticationStore()
    const { confirmar } = useNotificaciones()

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      TipoFotografia,
      new TipoFotografiaController()
    )
    const {
      entidad: tipoFotografia,
      disabled,
      accion,
      listadosAuxiliares,
      listado
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } =
      mixin.useComportamiento()

    /************
     * Variables
     ************/
    const tabDefecto = ref('1')
    const searchTable = ref<string | string[] | null>(null)
    const tipos_trabajos = ref([])

    /**
     * Métodos de filtrado para tipos de trabajo
     */
    function filtrarTipos_trabajos(val: string, update: (fn: () => void) => void) {
      update(() => {
        if (val === '') {
          tipos_trabajos.value = listadosAuxiliares.tipos_trabajos
        } else {
          tipos_trabajos.value = listadosAuxiliares.tipos_trabajos.filter((v: any) =>
            v.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1
          )
        }
      })
    }

    /****************************
     * Validaciones
     ****************************/
    const reglas = {
      nombre: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(100)
      },
      tipo_trabajo: { required }
    }

    const v$ = useVuelidate(reglas, tipoFotografia)
    setValidador(v$.value)

    /****************************
     * Inicialización
     ****************************/
    cargarVista(async () => {
      await obtenerListados({
        tipos_trabajos: {
          controller: new TipoTrabajoController(),
          params: { activo: 1 }
        }
      })
    }).then(() => {
      tipos_trabajos.value = listadosAuxiliares.tipos_trabajos
      listado.value = listadosAuxiliares.tipos_fotografias || []
    })

    /**
     * Métodos de filtrado
     */
    async function filtrarListadoTipoFotografias(tab: string) {
      tabDefecto.value = tab
      await listar({ activo: tab })
    }

    /**
     * Acciones personalizadas de la tabla
     */
    const btnEliminarTipoFotografia: CustomActionTable = {
      titulo: 'Eliminar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => store.can('puede.eliminar.tipos_fotografias'),
      accion: ({ posicion }) =>
        confirmar('¿Está seguro de continuar?', () => {
          listado.value.splice(posicion, 1)
        })
    }

    return {
      mixin,
      tipoFotografia,
      disabled,
      accion,
      acciones,
      v$,
      configuracionColumnas: configuracionColumnasTipoFotografias,
      tabDefecto,
      tabOptions: tabOptionsProveedoresInternacionales,
      tipos_trabajos,
      filtrarTipos_trabajos,
      btnEliminarTipoFotografia,
      filtrarListadoTipoFotografias,
      searchTable
    }
  }
})
