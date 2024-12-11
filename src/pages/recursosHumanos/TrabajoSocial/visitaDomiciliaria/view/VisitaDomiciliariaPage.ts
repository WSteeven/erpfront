import { defineComponent, ref } from 'vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { VisitaDomiciliaria } from 'trabajoSocial/visitaDomiciliaria/domain/VisitaDomiciliaria'
import { VisitaDomiciliariaController } from 'trabajoSocial/visitaDomiciliaria/infraestructure/VisitaDomiciliariaController'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import {
  configuracionColumnasVisitaDomiciliaria
} from 'trabajoSocial/visitaDomiciliaria/domain/configuracionColumnasVisitaDomiciliaria'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { tabOptionsProveedoresInternacionales } from 'config/utils_compras_proveedores'
import ComposicionFamiliar from 'trabajoSocial/composicion_familiar/view/ComposicionFamiliar.vue'

export default defineComponent({
  components: { ComposicionFamiliar, TabLayoutFilterTabs2, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      VisitaDomiciliaria,
      new VisitaDomiciliariaController()
    )
    const {
      entidad: visita,
      accion,
      disabled,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { listar, cargarVista, obtenerListados, setValidador } =
      mixin.useComportamiento()

    const tabDefecto = ref('1')
    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        //listados de empleados
      })
    })
    const reglas = {
      empleado: { required }
    }
    const v$ = useVuelidate(reglas, visita)
    setValidador(v$.value)

    /********************************
     * FUNCIONES
     *******************************/
    async function filtrarListadoVisitas(tab: string) {
      tabDefecto.value = tab
      await listar({ estado: tab })
    }

    return {
      mixin,
      v$,
      visita,
      accion,
      disabled,
      configuracionColumnas: configuracionColumnasVisitaDomiciliaria,
      tabOptions: tabOptionsProveedoresInternacionales,
      tabDefecto,

      //listados
      empleados,
      filtrarEmpleados,

      //funciones
      filtrarListadoVisitas

      //botones de tabla
    }
  }
})
