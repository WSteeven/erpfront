import { defineComponent, ref } from 'vue'
import { GastoCoordinadores } from '../domain/GastoCoordinadores'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import ErrorComponent from 'components/ErrorComponent.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, requiredIf } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { GastoCoordinadoresController } from '../infrestructure/GastoCoordinadoresController'
import { configuracionColumnasGasto } from '../domain/configuracionColumnasGasto'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { MotivoGastoController } from 'pages/fondosRotativos/MotivoGasto/infrestructure/MotivoGastoController'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { acciones, tabOptionsSolicitudesViaticos } from 'config/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

export default defineComponent({
  components: {
    TabLayoutFilterTabs2,
    NoOptionComponent,
    SelectorImagen,
    ErrorComponent,
  },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const authenticationStore = useAuthenticationStore()
    const {esContabilidad} = authenticationStore
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      GastoCoordinadores,
      new GastoCoordinadoresController()
    )
    const {
      entidad: gasto,
      disabled,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, consultar, listar } =
      mixin.useComportamiento()
    const {onModificado}=  mixin.useHooks()


    /*******
     * Init
     ******/
    const tabDefecto = ref('1')
    const estados = [
      { nombre: 'Pendiente', id: 1 }, //estado PENDIENTE
      { nombre: 'Completa', id: 2 }, //estado COMPLETA
      { nombre: 'Anulado', id: 4 }, //estado ANULADO
    ]

    /*************
     * Validaciones
     **************/
    const reglas = {
      lugar: {
        required
      },
      grupo: {
        required
      },
      monto: {
        required
      },
      motivo: {
        required
      },
      observacion: {
        required,
        minLength: minLength(25)
      },
      observacion_contabilidad: {
        required: requiredIf(()=>esContabilidad && accion.value === acciones.editar && gasto.estado!=1)
      }
    }

    const v$ = useVuelidate(reglas, gasto)
    setValidador(v$.value)
    const motivos = ref([])
    const autorizacionesEspeciales = ref([])

    const {cantones, filtrarCantones, grupos, filtrarGrupos} = useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        cantones: {
          controller: new CantonController(),
          params: { campos: 'id,canton' }
        },
        motivos: {
          controller: new MotivoGastoController(),
          params: { campos: 'id,nombre' }
        },
        grupos: {
          controller: new GrupoController(),
          params: { campos: 'id,nombre' }
        }
      })
      cantones.value = listadosAuxiliares.cantones
      motivos.value = listadosAuxiliares.motivos
      grupos.value = listadosAuxiliares.grupos
    })

    /**
     * HOOKS
     */
    onModificado(async ()=>
    await filtrarSolicitudes('1')
    )
    /*********
     * Funciones
     **********/
    async function filtrarSolicitudes(tab: string) {
      tabDefecto.value = tab
      await listar({ estado_id: tab })
    }

    /*********
     * Filtros
     **********/
    function filtrarMotivos(val, update) {
      if (val === '') {
        update(() => {
          motivos.value = listadosAuxiliares.motivos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        motivos.value = listadosAuxiliares.motivos.filter(
          v => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    const editarGasto: CustomActionTable = {
      titulo: ' ',
      icono: 'bi-pencil-square',
      color: 'secondary',
      visible: ({ entidad }) => {
        return entidad.usuario == authenticationStore.user.id && tabDefecto.value === '1' // mostrar si la pestaña es pendiente
      },
      accion: ({ entidad }) => {
        accion.value = acciones.editar
        consultar(entidad)
      }
    }

    return {
      mixin,
      gasto,
      cantones,
      grupos,
      motivos,
      disabled,
      accion,
      acciones,
      v$,
      configuracionColumnas: configuracionColumnasGasto,
      autorizacionesEspeciales,
      estados,
      filtrarGrupos,
      filtrarCantones,
      filtrarMotivos,
      editarGasto,
      tabDefecto,
      tabOptions: tabOptionsSolicitudesViaticos,
      filtrarSolicitudes,
      esContabilidad,
    }
  }
})
