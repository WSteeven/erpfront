import { defineComponent, ref } from 'vue'
import EmpleadoInfoPage from 'recursosHumanos/empleados/view/EmpleadoInfoPage.vue'
import SimpleLayout from 'shared/contenedor/modules/simple/view/SimpleLayout.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PlanVacacion } from 'recursosHumanos/planVacacion/domain/PlanVacacion'
import { PlanVacacionController } from 'recursosHumanos/planVacacion/infraestructure/PlanVacacionController'
import { useEmpleadoStore } from 'stores/empleado'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { VacacionController } from 'recursosHumanos/vacaciones/infraestructure/VacacionController'

export default defineComponent({
  components: { TabLayout, SimpleLayout, EmpleadoInfoPage },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      PlanVacacion,
      new PlanVacacionController()
    )
    const { entidad: plan, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
    const { cargarVista, obtenerListados } = mixin.useComportamiento()

    const empleadoStore = useEmpleadoStore()
    const empleado = ref()
    const vacaciones = ref()
    cargarVista(() => {
      obtenerListados({
        vacaciones: {
          controller: new VacacionController(),
          params: { empleado_id: empleadoStore.idEmpleado }
        }
      })
      vacaciones.value = listadosAuxiliares.vacaciones
      if (empleadoStore.idEmpleado > 0) {
        obtenerEmpleado(empleadoStore.idEmpleado)
      }
    })

    /****************
     * FUNCIONES
     ****************/
    async function obtenerEmpleado(id: number) {
      const { result } = await new EmpleadoController().listar({ id: id })
      console.log(result)
      empleado.value = result[0]
      empleadoStore.empleado.hydrate(result[0])
    }

    return {
      mixin,
      plan,
      disabled,
      accion,
      empleadoStore,
      empleado,

      // listados
      vacaciones,

      //funciones


    }
  }
})
