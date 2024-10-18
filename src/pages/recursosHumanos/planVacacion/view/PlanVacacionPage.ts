import { defineComponent, ref } from 'vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PlanVacacion } from 'recursosHumanos/planVacacion/domain/PlanVacacion'
import { PlanVacacionController } from 'recursosHumanos/planVacacion/infraestructure/PlanVacacionController'
import { useEmpleadoStore } from 'stores/empleado'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import SimpleLayout from 'shared/contenedor/modules/simple/view/SimpleLayout'

export default defineComponent({
  components: {TabLayout, SimpleLayout},
  setup(){
    const mixin = new ContenedorSimpleMixin(PlanVacacion, new PlanVacacionController())
    const {entidad: plan, disabled, accion} = mixin.useReferencias()
    const {cargarVista, obtenerListados,  }=mixin.useComportamiento()

    const empleadoStore = useEmpleadoStore()
    const empleado = ref()
    cargarVista(()=>{
      obtenerListados({

      })
      if(empleadoStore.idEmpleado>0){
    obtenerEmpleado(empleadoStore.idEmpleado)
      }
    })

    /****************
     * FUNCIONES
     ****************/
    async function obtenerEmpleado(id:number){
      const results =  (await new EmpleadoController().listar({ id: id }))[0]
      console.log(results)
      empleado.value = results
    }

    return{
      mixin, plan, disabled, accion,

      empleado,

      // listados

      //funciones


    }
  }
})
