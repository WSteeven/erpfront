// Dependencies
import { obtenerFechaActual, sumarFechas } from 'shared/utils'
import { maskFecha } from 'config/utils'
import { defineComponent, ref } from 'vue'

// Components
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { VacacionController } from 'recursosHumanos/vacaciones/infraestructure/VacacionController'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Vacacion } from 'recursosHumanos/vacaciones/domain/Vacacion'
import { tabOptionsVacaciones } from 'config/recursosHumanos.utils'
import { configuracionColumnasVacaciones } from 'recursosHumanos/vacaciones/domain/configuracionColumnasVacaciones'
import { useVuelidate } from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import { PeriodoController } from 'recursosHumanos/periodo/infraestructure/PeriodoController'

export default defineComponent({
  components: { EssentialTable, TabLayoutFilterTabs2 },
  setup() {
    const mixin = new ContenedorSimpleMixin(Vacacion, new VacacionController())
    const { entidad: vacacion, listadosAuxiliares, disabled } = mixin.useReferencias()
    const { setValidador,obtenerListados, cargarVista, listar } = mixin.useComportamiento()

    const tabDefecto = ref('PENDIENTES')
    const { empleados,    periodos} =      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            estado: 1,
            'fecha_ingreso[operator]': '<',
            'fecha_ingreso[value]': sumarFechas(
              obtenerFechaActual(),
              -1,
              0,
              0,
              maskFecha
            )
          }
        },
        periodos: {controller: new PeriodoController(), params:{activo:1}}
      })

      empleados.value = listadosAuxiliares.empleados
      periodos.value = listadosAuxiliares.periodos
    })

    const reglas = {
      empleado: {required},
      periodo: {required},
    }
    const v$ = useVuelidate(reglas, vacacion)
    setValidador(v$.value)

    /*******************************************************************************************
     * Funciones
     ******************************************************************************************/
    async function filtrar(tab: string) {
      tabDefecto.value = tab
      await listar({ tipo: tab })
    }

    return {
      mixin,v$, disabled,
      vacacion,
      tabDefecto,
      configuracionColumnas: configuracionColumnasVacaciones,
      tabOptions: tabOptionsVacaciones,
      maskFecha,
      // listados
      empleados, periodos,

      //funciones
      filtrar
    }
  }
})
