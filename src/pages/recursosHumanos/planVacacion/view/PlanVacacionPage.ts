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
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { required } from 'shared/i18n-validators'
import { obtenerFechaActual, ordenarLista, sumarFechas } from 'shared/utils'
import { useVuelidate } from '@vuelidate/core'
import { maskFecha } from 'config/utils'

export default defineComponent({
  components: { TabLayout, SimpleLayout, EmpleadoInfoPage },
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
    const { setValidador, cargarVista, obtenerListados } =
      mixin.useComportamiento()

    const empleadoStore = useEmpleadoStore()
    const empleado = ref()
    const vacaciones = ref()

    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(() => {
      obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            estado: 1,
            'fecha_ingreso[operator]': '<=',
            'fecha_ingreso[value]': sumarFechas(obtenerFechaActual(),-1,0,0,maskFecha)
          }
        },
        vacaciones: {
          controller: new VacacionController(),
          params: { empleado_id: empleadoStore.idEmpleado }
        }
      })
    })
    const reglas = {
      empleado: { required }
    }
    const v$ = useVuelidate(reglas, plan)
    setValidador(v$.value)

    /****************
     * FUNCIONES
     ****************/
    async function obtenerEmpleado(id: number) {
      const { result } = await new EmpleadoController().listar({ id: id })
      console.log(result)
      empleado.value = result[0]
      empleadoStore.empleado.hydrate(result[0])
    }

    async function seleccionarEmpleado(){
      await obtenerEmpleado(plan.empleado)
      const { result} = await new VacacionController().listar({empleado_id: plan.empleado})
      listadosAuxiliares.vacaciones = result
      vacaciones.value = listadosAuxiliares.vacaciones
    }

    return {
      mixin,
      v$,
      plan,
      disabled,
      accion,
      empleadoStore,
      empleado,

      // listados
      vacaciones,
      empleados,
      filtrarEmpleados,

      //funciones
      ordenarLista,
      seleccionarEmpleado,
    }
  }
})
