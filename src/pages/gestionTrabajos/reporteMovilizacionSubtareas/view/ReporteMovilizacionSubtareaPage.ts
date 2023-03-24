// Dependencias
import { configuracionColumnasMovilizacionSubtarea } from '../domain/configuracionColumnasMovilizacionSubtarea'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import { accionesTabla, maskFecha } from 'config/utils'
import { defineComponent, reactive, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { TrabajoAsignadoController } from 'pages/gestionTrabajos/trabajoAsignado/infraestructure/TrabajoAsignadoController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { MovilizacionSubtareaController } from 'pages/gestionTrabajos/movilizacionSubtareas/infraestructure/MovilizacionSubtareaController'
import { MovilizacionSubtarea } from 'pages/gestionTrabajos/movilizacionSubtareas/domain/MovilizacionSubtarea'
import { ReporteMovilizacionSubtarea } from '../domain/ReporteMovilizacionSubtarea'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      MovilizacionSubtarea,
      new MovilizacionSubtareaController()
    )
    const { entidad: movilizacion, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { cargarVista, obtenerListados, setValidador, listar } =
      mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        empleados: new EmpleadoController(),
      })
      empleados.value = listadosAuxiliares.empleados
    })

    const reporteMovilizacion = reactive(new ReporteMovilizacionSubtarea())
    const rules = {
      subtarea: { required },
      fecha_desde: { required },
      fecha_hasta: { required },
    }

    function buscar() {
      listar({
        empleado_id: reporteMovilizacion.empleado
      })
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, reporteMovilizacion)
    // setValidador(v$.value)

    // Filtro clientes principales
    const empleados = ref()
    function filtrarEmpleados(val, update) {
      if (val === '') {
        update(() => {
          empleados.value = listadosAuxiliares.empleados
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        empleados.value = listadosAuxiliares.empleados.filter(
          (v) => v.nombres.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    return {
      reporteMovilizacion,
      buscar,
      // mixin
      mixin,
      listado,
      movilizacion,
      disabled,
      accion,
      v$,
      configuracionColumnasMovilizacionSubtarea,
      filtrarEmpleados,
      empleados,
      maskFecha,
    }
  },
})
