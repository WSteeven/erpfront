import { defineComponent, Ref, ref } from 'vue'
import EmpleadoInfoPage from 'recursosHumanos/empleados/view/EmpleadoInfoPage.vue'
import SimpleLayout from 'shared/contenedor/modules/simple/view/SimpleLayout.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PlanVacacion } from 'recursosHumanos/planVacacion/domain/PlanVacacion'
import { PlanVacacionController } from 'recursosHumanos/planVacacion/infraestructure/PlanVacacionController'
import { useEmpleadoStore } from 'stores/empleado'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { VacacionController } from 'recursosHumanos/vacaciones/infraestructure/VacacionController'
import { Vacacion } from 'recursosHumanos/vacaciones/domain/Vacacion'
import FormularioPlanVacaciones from 'recursosHumanos/planVacacion/view/FormularioPlanVacaciones.vue'
import { acciones } from 'config/utils'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { configuracionColumnasDetallesVacacion } from 'recursosHumanos/vacaciones/modules/detallesVacaciones/domain/configuracionColumnasDetallesVacacion'
import VacacionLitePage from 'recursosHumanos/vacaciones/view/VacacionLitePage.vue'

export default defineComponent({
  components: {
    VacacionLitePage,
    EssentialTable,
    TabLayout,
    SimpleLayout,
    EmpleadoInfoPage,
    FormularioPlanVacaciones
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      PlanVacacion,
      new PlanVacacionController()
    )
    const {
      entidad: plan,
      disabled,
      listadosAuxiliares,
      accion
    } = mixin.useReferencias()
    const { cargarVista, obtenerListados } = mixin.useComportamiento()

    const empleadoStore = useEmpleadoStore()
    const identificador = ref(-1)
    const empleado = ref()
    const mostrarPlanVacacion = ref(false)
    const habilitarBotones = ref(false)
    const vacaciones: Ref<Vacacion[]> = ref([])
    const planes_vacaciones = ref([])

    cargarVista(async () => {
      plan.empleado = empleadoStore.idEmpleado
      await obtenerListados({
        vacaciones: {
          controller: new VacacionController(),
          params: { empleado_id: empleadoStore.idEmpleado }
        },
        planes_vacaciones: []
      })
      vacaciones.value = listadosAuxiliares.vacaciones
      if (empleadoStore.idEmpleado > 0) {
        await obtenerEmpleado(empleadoStore.idEmpleado)
        await obtenerPlanesVacaciones()
      }
    })

    /****************
     * FUNCIONES
     ****************/
    async function obtenerEmpleado(id: number) {
      const { result } = await new EmpleadoController().listar({ id: id })
      empleado.value = result[0]
      empleadoStore.empleado.hydrate(result[0])
    }

    async function obtenerPlanesVacaciones() {
      habilitarBotones.value = false
      mostrarPlanVacacion.value = false
      listadosAuxiliares.planes_vacaciones = []
      if (vacaciones.value.length > 0) {
        for (const vacacion of vacaciones.value) {
          const { result } = await new PlanVacacionController().listar({
            empleado_id: empleadoStore.idEmpleado,
            // empleado: empleadoStore.idEmpleado,
            periodo_id: vacacion.periodo_id
          })
          if (result.length > 0) {
            console.log('Entro en el if', result)
            listadosAuxiliares.planes_vacaciones.push(result[0])
          }
        }
      } else {
        const { result } = await new PlanVacacionController().listar({
          empleado_id: empleadoStore.idEmpleado
        })
        // console.log(result)
        listadosAuxiliares.planes_vacaciones = result
        // console.log(listadosAuxiliares.planes_vacaciones)
      }
      planes_vacaciones.value = listadosAuxiliares.planes_vacaciones
      mostrarPlanVacacion.value = true
    }

    const cancelar = id => {
      // console.log('cancelo la operacion', id)
      identificador.value = id
    }
    const obtenerAccion = (periodo: string | number) => {
      if (planes_vacaciones.value !== undefined) {
        if (planes_vacaciones.value.length > 0)
          return planes_vacaciones.value.find(plan => plan.periodo == periodo)
            ? acciones.editar
            : acciones.nuevo
        else return acciones.nuevo
      } else return acciones.nuevo
    }

    return {
      mixin,
      plan,
      disabled,
      accion,
      acciones,
      empleadoStore,
      empleado,
      identificador,
      mostrarPlanVacacion,
      habilitarBotones,
      configuracionColumnasDetallesVacacion,
      // listados
      planes_vacaciones,
      vacaciones,

      //funciones
      cancelar,
      obtenerPlanesVacaciones,
      obtenerAccion
    }
  }
})
