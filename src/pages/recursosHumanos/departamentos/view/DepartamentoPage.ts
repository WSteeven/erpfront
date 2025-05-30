// Dependencias
import { configuracionColumnasDepartamento } from '../domain/configuracionColumnasDepartamento'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { DepartamentoController } from '../infraestructure/DepartamentoController'
import { Departamento } from '../domain/Departamento'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useFiltrosListadosTickets } from 'pages/gestionTickets/tickets/application/FiltrosListadosTicket'
import {configuracionColumnasEmpleadosLite} from 'recursosHumanos/empleados/domain/configuracionColumnasEmpleadosLite';

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Departamento,
      new DepartamentoController()
    )
    const { entidad: departamento, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { estado: 1 }
        }
      })
    })

    const {
      empleados,
      filtrarEmpleados,
    } = useFiltrosListadosTickets(listadosAuxiliares)

    const rules = {
      nombre: { required },
      responsable: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, departamento)
    setValidador(v$.value)

    return {
      v$,
      mixin,
      departamento,
      disabled,
      accion,
      configuracionColumnasDepartamento,
      configuracionColumnasEmpleadosLite,
      empleados,
      filtrarEmpleados,
    }
  },
})
