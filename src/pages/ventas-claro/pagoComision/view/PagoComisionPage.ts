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
import { acciones, accionesTabla, maskFecha, } from 'config/utils'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar, date } from 'quasar'
import { PagoComision } from '../domain/PagoComision'
import { PagoComisionController } from '../infrestucture/PagoComisionController'
import { tabOptionsPagosComisiones } from 'config/ventas.utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { usePagaComisionStore } from 'stores/ventasClaro/pagoComision'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificacionStore } from 'stores/notificacion'


export default defineComponent({
  components: { TabLayoutFilterTabs2, ModalesEntidad, SelectorImagen, EssentialTable, EssentialTableTabs, },
  setup() {
    const mixin = new ContenedorSimpleMixin(PagoComision, new PagoComisionController())
    const { entidad: pago, accion, disabled, listado } = mixin.useReferencias()
    const { setValidador, cargarVista, listar } = mixin.useComportamiento()
    const { onGuardado, onReestablecer } = mixin.useHooks()
    const { notificarCorrecto, notificarError, confirmar, prompt } = useNotificaciones()

    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const corteStore = usePagaComisionStore()

    const tabDefecto = ref('PENDIENTE')

    const fecha = ref()
    const ultima_fecha = ref()
    const fechasDisponibles = ref()
    // const fecha_minima = ref('2024/02/01')
    const fecha_inicio = computed(() => fecha.value.from)
    const fecha_fin = computed(() => fecha.value.to)
    const nombre = computed(() => 'Pago de comisiones desde ' + fecha.value.from + ' al ' + fecha.value.to)

    cargarVista(async () => {
      const arrayfechas = Object.values(await corteStore.obtenerFechasDisponiblesCortes())
      fechasDisponibles.value = arrayfechas
    })


    const reglas = {
      fecha_inicio: { required, },
      fecha_fin: { required, },
    }
    const v$ = useVuelidate(reglas, pago)
    setValidador(v$.value)

    /*****************************************************************************************
     * HOOKS
     ****************************************************************************************/
    onGuardado(() => {
      console.log('guardado')
    })
    onReestablecer(async () => {
      const arrayfechas = Object.values(await corteStore.obtenerFechasDisponiblesCortes())
      fechasDisponibles.value = arrayfechas
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

    function options(fecha: string) {
      // const arrayFecha = ultima_fecha.value.toString().split('-').map(Number) //recibe YYYY-MM-DD
      // const ultima_fecha_construida = date.buildDate({ year: arrayFecha[0], month: arrayFecha[1], day: arrayFecha[2] })
      // return fecha > date.formatDate(ultima_fecha_construida, 'YYYY/MM/DD') && fecha <= date.formatDate(new Date(), 'YYYY/MM/DD')
      return fechasDisponibles.value.includes(fecha) // fechasDisponibles.value.includes(fecha)
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

    /*****************************************************************************************
     * BOTONES DE TABLA
     ****************************************************************************************/
    const btnGenerarReporteExcel: CustomActionTable = {
      titulo: 'Generar Reporte',
      color: 'positive',
      icono: 'bi-file-earmark-excel-fill',
      accion: async ({ entidad, posicion }) => {
        corteStore.corte.nombre = entidad.nombre
        corteStore.idCorte = entidad.id
        await corteStore.imprimirExcel()
      }
    }
    const btnAnular: CustomActionTable = {
      titulo: 'Anular',
      color: 'negative',
      icono: 'bi-x',
      accion: async ({ entidad, posicion }) => {
        confirmar('¿Está seguro de anular el corte?', () => {
          const data: CustomActionPrompt = {
            titulo: 'Causa de anulación',
            mensaje: 'Ingresa el motivo de anulación',
            accion: async (data) => {
              try {
                corteStore.idCorte = entidad.id
                const response = await corteStore.anularCorte({ causa_anulacion: data })
                if (response!.status == 200) {
                  notificarCorrecto('Se ha anulado correctamente el corte de pagos')
                  listado.value.splice(posicion, 1)
                }
              } catch (e: any) {
                notificarError('No se pudo anular, debes ingresar un motivo para la anulación')
              }
            }
          }
          prompt(data)
        })
      },
      visible: ({ entidad }) => entidad.estado == 'PENDIENTE'
    }

    const btnMarcarPagado: CustomActionTable = {
      
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

      // botones de tabla
      btnAnular,
      btnMarcarPagado,
      btnGenerarReporteExcel,

      options,
      updateProxy,
      save,
      filtrarCortesComisiones,

    }
  },
})
