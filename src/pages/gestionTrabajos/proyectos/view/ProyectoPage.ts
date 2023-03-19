// Dependencias
import { configuracionColumnasProyecto } from '../domain/configuracionColumnasProyectos'
import { required, requiredIf, maxLength, helpers } from 'shared/i18n-validators'
import { useNotificacionStore } from 'stores/notificacion'
import { defineComponent, ref, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { CantonController } from 'pages/sistema/ciudad/infraestructure/CantonControllerontroller'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { ProyectoController } from '../infraestructure/ProyectoController'
import { Proyecto } from '../domain/Proyecto'
import { rolesSistema } from 'config/utils'
import { useAuthenticationStore } from 'stores/authentication'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  emits: ['guardado', 'cerrar-modal'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(
      Proyecto,
      new ProyectoController()
    )
    const { entidad: proyecto, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados, setValidador } =
      mixin.useComportamiento()
    const { onGuardado } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController(),
        cantones: new CantonController(),
        coordinadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.coordinador },
        },
        fiscalizadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.fiscalizador },
        },
      })
      clientes.value = listadosAuxiliares.clientes
      cantones.value = listadosAuxiliares.cantones
      coordinadores.value = listadosAuxiliares.coordinadores
      fiscalizadores.value = listadosAuxiliares.fiscalizadores
    })

    /************
     * Variables
     ************/
    const authenticationStore = useAuthenticationStore()
    const mostrarCoordinador = computed(() => authenticationStore.esJefeTecnico)

    // Validaciones
    const fechaFinMayor = (valor: string) => valor > (proyecto.fecha_inicio ?? 0)
    const fechaInicioMenor = (valor: string) => valor < (proyecto.fecha_fin ?? 0)

    const rules = {
      cliente: { required },
      codigo_proyecto: { required, maxLength },
      fecha_inicio: { required, fechaMenor: helpers.withMessage('La fecha de inicio de proyecto no puede ser menor o igual que su fecha de fin', fechaInicioMenor) },
      fecha_fin: { required, fechaMayor: helpers.withMessage('La fecha de fin de proyecto no puede ser mayor o igual que su fecha de inicio', fechaFinMayor) },
      nombre: { required },
      canton: { required },
      coordinador: { required: requiredIf(() => mostrarCoordinador.value) },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, proyecto)
    setValidador(v$.value)

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
          (v) => v.razon_social.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // Filtro cantones
    const cantones = ref([])
    function filtrarCantones(val, update) {
      if (val === '') {
        update(() => {
          cantones.value = listadosAuxiliares.cantones
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        cantones.value = listadosAuxiliares.cantones.filter(
          (v) => v.canton.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // Filtro coordinadores
    const coordinadores = ref()
    function filtrarCoordinadores(val, update) {
      if (val === '') {
        update(() => {
          coordinadores.value = listadosAuxiliares.coordinadores
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        coordinadores.value = listadosAuxiliares.coordinadores.filter(
          (v) => v.nombres.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // Filtro fiscalizadores
    const fiscalizadores = ref()
    function filtrarFiscalizadores(val, update) {
      if (val === '') update(() => fiscalizadores.value = listadosAuxiliares.fiscalizadores)
      update(() => {
        const needle = val.toLowerCase()
        fiscalizadores.value = listadosAuxiliares.fiscalizadores.filter(
          (v) => v.nombres.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    /********
     * Hooks
     ********/
    onGuardado(() => {
      emit('cerrar-modal')
      emit('guardado', 'ProyectoPage')
    })

    return {
      mixin,
      proyecto,
      disabled,
      accion,
      v$,
      configuracionColumnasProyecto,
      clientes,
      cantones,
      coordinadores,
      fiscalizadores,
      filtrarClientes,
      filtrarCantones,
      filtrarCoordinadores,
      filtrarFiscalizadores,
      mostrarCoordinador,
    }
  },
})
