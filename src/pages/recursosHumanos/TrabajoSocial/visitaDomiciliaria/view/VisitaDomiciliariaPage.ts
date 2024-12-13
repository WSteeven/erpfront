import { computed, defineComponent, ref } from 'vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { VisitaDomiciliaria } from 'trabajoSocial/visitaDomiciliaria/domain/VisitaDomiciliaria'
import { VisitaDomiciliariaController } from 'trabajoSocial/visitaDomiciliaria/infraestructure/VisitaDomiciliariaController'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { configuracionColumnasVisitaDomiciliaria } from 'trabajoSocial/visitaDomiciliaria/domain/configuracionColumnasVisitaDomiciliaria'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { tabOptionsProveedoresInternacionales } from 'config/utils_compras_proveedores'
import ComposicionFamiliar from 'trabajoSocial/composicion_familiar/view/ComposicionFamiliar.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import SaludEmpleado from 'trabajoSocial/salud/view/SaludEmpleado.vue'
import { opcionesPeriodicidad } from 'config/recursosHumanos.utils'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import { configuracionColumnasIngresos } from 'trabajoSocial/visitaDomiciliaria/domain/configuracionColumnasIngresos'
import {
  EconomiaFamiliar,
  Ingreso
} from 'trabajoSocial/visitaDomiciliaria/domain/EconomiaFamiliar'
import { btnEliminarDefault, encontrarUltimoIdListado } from 'shared/utils'
import { acciones, accionesTabla } from 'config/utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import InformacionVivienda from 'trabajoSocial/informacion_vivienda/view/InformacionVivienda.vue'
import ServiciosBasicos from 'trabajoSocial/servicios_basicos/view/ServiciosBasicos.vue'
import CroquisVivienda from 'trabajoSocial/informacion_vivienda/view/CroquisVivienda.vue'

export default defineComponent({
  components: {
    CroquisVivienda,
    ServiciosBasicos,
    InformacionVivienda,
    OptionGroupComponent,
    SaludEmpleado,
    SelectorImagen,
    ComposicionFamiliar,
    TabLayoutFilterTabs2,
    EssentialTable
  },
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
      empleado: { required },
      observaciones: { required },
      diagnostico_social: { required },
      salud: {
        frecuencia_asiste_medico: { required },
        frecuencia_practica_deporte: { required }
      }
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

    //aqui se suma el total de ingresos
    if (visita.economia_familiar instanceof EconomiaFamiliar) {
      visita.economia_familiar.total_ingresos = computed(() =>
        visita.economia_familiar.ingresos
          .reduce((prev, curr) => prev + parseFloat(curr.ingreso_mensual), 0)
          .toFixed(2)
      )
      visita.economia_familiar.total_egresos = computed(
        () =>
          Number(visita.economia_familiar.eg_vivienda) +
          Number(visita.economia_familiar.eg_servicios_basicos) +
          Number(visita.economia_familiar.eg_educacion) +
          Number(visita.economia_familiar.eg_salud) +
          Number(visita.economia_familiar.eg_vestimenta) +
          Number(visita.economia_familiar.eg_alimentacion) +
          Number(visita.economia_familiar.eg_transporte) +
          Number(visita.economia_familiar.eg_prestamos) +
          Number(visita.economia_familiar.eg_otros_gastos)
      )
      visita.economia_familiar.total = computed(
        () =>
          Number(visita.economia_familiar?.total_ingresos) -
          Number(visita.economia_familiar?.total_egresos)
      )
    }

    /********************************
     * BOTONES DE TABLA
     *******************************/
    const btnAgregarIngreso: CustomActionTable = {
      titulo: 'Agregar',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar fila',
      accion: () => {
        const ingreso: Ingreso = {
          id: null,
          nombres_apellidos: null,
          ocupacion: null,
          ingreso_mensual: 0
        }
        ingreso.id = visita.economia_familiar.ingresos?.length
          ? encontrarUltimoIdListado(visita.economia_familiar.ingresos) + 1
          : 1
        visita.economia_familiar.ingresos.push(ingreso)
      },
      visible: () => [acciones.nuevo, acciones.editar].includes(accion.value)
    }

    return {
      mixin,
      v$,
      visita,
      accion,
      disabled,
      configuracionColumnas: configuracionColumnasVisitaDomiciliaria,
      configuracionColumnasIngresos,
      tabOptions: tabOptionsProveedoresInternacionales,
      tabDefecto,
      acciones,
      accionesTabla,

      //listados
      empleados,
      filtrarEmpleados,
      opcionesPeriodicidad,

      //funciones
      filtrarListadoVisitas,

      //botones de tabla
      btnAgregarIngreso,
      btnEliminarDefault
    }
  }
})
