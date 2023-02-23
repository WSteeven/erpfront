// Dependencias
import { configuracionColumnasClienteFinal } from '../domain/configuracionColumnasClienteFinal'
import { useNotificacionStore } from 'stores/notificacion'
import { computed, defineComponent, ref } from 'vue'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'
// import { rolesSistema } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
// import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CantonController } from 'pages/sistema/ciudad/infraestructure/CantonControllerontroller'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { ProvinciaController } from 'sistema/provincia/infraestructure/ProvinciaController'
import { ClienteFinalController } from '../infraestructure/ClienteFinalController'
import { ClienteFinal } from '../domain/ClienteFinal'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      ClienteFinal,
      new ClienteFinalController()
    )
    const { entidad: clienteFinal, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados, setValidador } =
      mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController(),
        provincias: new ProvinciaController(),
        cantones: new CantonController(),
      })
      clientes.value = listadosAuxiliares.clientes
      cantones.value = listadosAuxiliares.cantones
      provincias.value = listadosAuxiliares.provincias
    })

    const rules = {
      cliente: { required },
      id_cliente_final: { required },
      nombres: { required },
      apellidos: { required },
      celular: { required },
      provincia: { required },
      canton: { required },
      parroquia: { required },
      direccion: { required },
      referencia: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, clienteFinal)
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

    // Filtro provincias
    const provincias = ref()
    function filtrarProvincias(val, update) {
      if (val === '') {
        update(() => {
          provincias.value = listadosAuxiliares.provincias
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        provincias.value = listadosAuxiliares.provincias.filter(
          (v) => v.provincia.toLowerCase().indexOf(needle) > -1
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

    const cantonesPorProvincia = computed(() => cantones.value.filter((canton: any) => canton.provincia_id === clienteFinal.provincia))

    return {
      // mixin
      mixin,
      clienteFinal,
      disabled,
      accion,
      listadosAuxiliares,
      v$,
      configuracionColumnasClienteFinal,
      clientes,
      cantones,
      filtrarClientes,
      filtrarCantones,
      filtrarProvincias,
      cantonesPorProvincia,
    }
  },
})
