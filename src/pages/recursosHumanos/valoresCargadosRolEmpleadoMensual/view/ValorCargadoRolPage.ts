import { defineComponent } from 'vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ValorCargadoRol } from 'recursosHumanos/valoresCargadosRolEmpleadoMensual/domain/ValorCargadoRol'
import { ValorCargadoRolController } from 'recursosHumanos/valoresCargadosRolEmpleadoMensual/infraestructure/ValorCargadoRolController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { configuracionColumnasValoresCargadosRoles } from 'recursosHumanos/valoresCargadosRolEmpleadoMensual/domain/configuracionColumnasValoresCargadosRoles'
import { ordenarLista } from 'shared/utils'

export default defineComponent({
  components: {TabLayout},
  setup(){
    const mixin = new ContenedorSimpleMixin(ValorCargadoRol, new ValorCargadoRolController())
    const {entidad, listadosAuxiliares  }= mixin.useReferencias()
    const { cargarVista, obtenerListados}= mixin.useComportamiento()

    const {empleados, filtrarEmpleados} = useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(()=>{
      obtenerListados({
        empleados: {controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 } }
      })

        empleados.value = listadosAuxiliares.empleados
    })



    return {
      mixin, entidad,
      configuracionColumnas: configuracionColumnasValoresCargadosRoles,
      // listados
      empleados, filtrarEmpleados,

      //funciones
      ordenarLista,
    }
  }
})
