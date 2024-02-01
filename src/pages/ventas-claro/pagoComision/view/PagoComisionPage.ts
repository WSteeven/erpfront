// Dependencias
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, } from 'vue'
import { configuracionColumnasPagoComision } from '../domain/configuracionColumnasPagoComision'
import { configuracionColumnasPagoComisionEmpleado } from '../domain/configuracionColumnasPagoComisionEmpleado'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { acciones, accionesTabla, convertir_fecha, maskFecha, } from 'config/utils'
import { useCargandoStore } from 'stores/cargando'
import Quasar, { useQuasar, date } from 'quasar'
import { PagoComision } from '../domain/PagoComision'
import { PagoComisionController } from '../infrestucture/PagoComisionController'
import { formatearFecha, formatearFechaSeparador } from 'shared/utils'
import { tabOptionsPagosComisiones } from 'config/ventas.utils'


export default defineComponent({
  components: { TabLayoutFilterTabs2, ModalesEntidad, SelectorImagen, EssentialTable, EssentialTableTabs, },
  setup() {
    const mixin = new ContenedorSimpleMixin(PagoComision, new PagoComisionController())
    const { entidad: pago, accion, disabled, listado } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } = mixin.useComportamiento()
    const { onGuardado } = mixin.useHooks()

    useCargandoStore().setQuasar(useQuasar())

    const tabDefecto = ref('PENDIENTE')

    const fecha = ref()
    const ultima_fecha = ref()
    // const fecha_minima = ref('2024/02/01')
    const fecha_inicio = computed(() => fecha.value.from)
    const fecha_fin = computed(() => fecha.value.to)
    const nombre = computed(() => 'Pago de comisiones desde ' + fecha.value.from + ' al ' + fecha.value.to)



    const reglas = {
      fecha_inicio: { required, },
      fecha_fin: { required, },
    }
    const v$ = useVuelidate(reglas, pago)
    setValidador(v$.value)

    onGuardado(() => {
      console.log('guardado')
    })
    /*****************************************************************************************
     * FUNCIONES
     ****************************************************************************************/
    function filtrarCortesComisiones(tab: string) {
      tabDefecto.value = tab
      listar({ estado: tab })
    }
    /**
     * La función verifica si una fecha determinada está dentro de un rango definido por la última
     * fecha y la fecha actual.
     * @param fecha - El parámetro "fecha" representa una fecha que se está comparando con la fecha
     * actual.
     * @returns un valor booleano. Comprueba si la fecha ingresada es mayor que la última fecha y menor
     * o igual a la fecha actual.
     */
    function options(fecha) {
      const arrayFecha = ultima_fecha.value.toString().split('-').map(Number) //recibe YYYY-MM-DD
      const ultima_fecha_construida = date.buildDate({ year: arrayFecha[0], month: arrayFecha[1], day: arrayFecha[2] })
      return fecha > date.formatDate(ultima_fecha_construida, 'YYYY/MM/DD') && fecha <= date.formatDate(new Date(), 'YYYY/MM/DD')
    }
    function updateProxy() {
      const listadoOrdenado = listado.value.sort((a, b) => b.id - a.id)[0] //ordenacion descendente
      ultima_fecha.value = listadoOrdenado.fecha_fin
      fecha.value = ultima_fecha.value
      // console.log(ultima_fecha.value)
    }
    function save() {
      pago.nombre = nombre.value
      pago.fecha_inicio = fecha_inicio.value
      pago.fecha_fin = fecha_fin.value
    }

    return {
      mixin,
      v$,
      pago,
      accion, acciones, accionesTabla,
      disabled,
      fecha,
      maskFecha,
      configuracionColumnas: configuracionColumnasPagoComision,
      configuracionColumnasPagoComisionEmpleado,

      tabDefecto,
      tabOptionsPagosComisiones,


      options,
      updateProxy,
      save,
      filtrarCortesComisiones,

    }
  },
})
