// Dependencias
import { configuracionColumnasProyecto } from '../domain/configuracionColumnasProyectos'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from '@vuelidate/validators'
import { defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { ProyectoController } from '../infraestructure/ProyectoController'
import { Proyecto } from '../domain/Proyecto'
import { CantonController } from 'pages/sistema/ciudad/infraestructure/CantonControllerontroller'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { rolesAdmitidos } from 'config/utils'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Proyecto,
      new ProyectoController()
    )
    const { entidad: proyecto, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados, setValidador } =
      mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController(),
        cantones: new CantonController(),
        coordinadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesAdmitidos.coordinador },
        },
      })
      clientes.value = listadosAuxiliares.clientes
      cantones.value = listadosAuxiliares.cantones
      coordinadores.value = listadosAuxiliares.coordinadores
    })

    const rules = {
      cliente: { required },
      codigo_proyecto: { required },
      fecha_inicio: { required },
      fecha_fin: { required },
      nombre: { required },
      canton: { required },
      coordinador: { required },
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
      filtrarClientes,
      filtrarCantones,
      filtrarCoordinadores,
    }
  },
})
