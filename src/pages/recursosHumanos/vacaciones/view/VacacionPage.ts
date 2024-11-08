// Dependencies
import { acciones, accionesTabla, maskFecha } from 'config/utils'
import { defineComponent, ref } from 'vue'

// Components
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

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
import { configuracionColumnasDetallesVacacion } from 'recursosHumanos/vacaciones/modules/detallesVacaciones/domain/configuracionColumnasDetallesVacacion'
import { DetalleVacacion } from 'recursosHumanos/vacaciones/modules/detallesVacaciones/domain/DetalleVacacion'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ComportamientoModalesVacaciones } from 'recursosHumanos/vacaciones/application/ComportamientoModalesVacaciones'
import { DetalleVacacionPropsInterface } from 'recursosHumanos/vacaciones/domain/DetalleVacacionPropsInterface'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: { EssentialTable, TabLayoutFilterTabs2, ModalesEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(Vacacion, new VacacionController())
    const {
      entidad: vacacion,
      listadosAuxiliares,
      accion,
      disabled
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    const {notificarInformacion}=useNotificaciones()
    const modales = new ComportamientoModalesVacaciones()

    const tabDefecto = ref('PENDIENTES')
    const { empleados, periodos } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            estado: 1,
            // 'fecha_ingreso[operator]': '<',
            // 'fecha_ingreso[value]': sumarFechas(
            //   obtenerFechaActual(),
            //   -1,
            //   0,
            //   0,
            //   maskFecha
            // )
          }
        },
        periodos: { controller: new PeriodoController(), params: { activo: 1 } }
      })

      empleados.value = listadosAuxiliares.empleados
      periodos.value = listadosAuxiliares.periodos
    })

    const reglas = {
      empleado: { required },
      periodo: { required }
    }
    const v$ = useVuelidate(reglas, vacacion)
    setValidador(v$.value)

    /*******************************************************************************************
     * FUNCIONES
     ******************************************************************************************/
    async function filtrar(tab: string) {
      tabDefecto.value = tab
      await listar({ tipo: tab })
    }

    async function guardado(data) {
      switch (data.accion) {
        case acciones.editar: // cuando se edita una fila
          const index = vacacion.detalles.findIndex(
            (detalle: DetalleVacacion) => detalle.id === data.id
          )
          if (index !== -1)
            vacacion.detalles.splice(index, 1, data.response.modelo)
          break
        default: // Cuando se crea una nueva fila
          vacacion.detalles.push(data.response.modelo)
      }
      // Recalcular los días correspondientes a la vacación
      recalcularDias()
    }

    function recalcularDias() {
      vacacion.dias_tomados = vacacion.detalles.reduce(
        (sum: number, detalle: DetalleVacacion) =>
          sum + detalle.dias_utilizados,
        0
      )
      vacacion.dias_disponibles = vacacion.dias - vacacion.dias_tomados
    }

    const checkOptoPago = (val)=>{
      if(val) elegirFormaPago()
    }

    /**
     * Notifica que dichas vacaciones serán pagaadas por Rol de Pagos.
     * Se deja esto como función en caso de que en un futuro se requiera profundizar en otros métodos de pago.
     */
    function elegirFormaPago(){
      notificarInformacion('Esta opción creará un registro de pago en rol de pagos')

    }
    /*******************************************************************************************
     * BOTONES DE TABLA
     ******************************************************************************************/

    const btnAgregarDetalle: CustomActionTable<DetalleVacacion> = {
      titulo: 'Agregar detalle',
      icono: 'bi-arrow-bar-down',
      color: 'primary',
      tooltip: 'Agregar Registro de Vacaciones',
      accion: () => {
        modales.abrirModalEntidad<{ vacacion_id: number; accion: string }>(
          'DetalleVacacionPage',
          { vacacion_id: vacacion.id, accion: acciones.nuevo }
        )
      },
      visible: () => accion.value === acciones.editar
    }

    const btnEditarDetalle: CustomActionTable<DetalleVacacion> = {
      titulo: 'Editar',
      icono: 'bi-pencil-square',
      color: 'secondary',
      tooltip: 'Editar Registro de Vacaciones',
      accion: ({ entidad }) => {
        modales.abrirModalEntidad<DetalleVacacionPropsInterface>(
          'DetalleVacacionPage',
          {
            vacacion_id: vacacion.id,
            accion: acciones.editar,
            entidad: entidad
          }
        )
      },
      visible: () => accion.value === acciones.editar
    }

    return {
      mixin,
      v$,
      disabled,
      accion,
      acciones,
      accionesTabla,
      vacacion,
      tabDefecto,
      configuracionColumnas: configuracionColumnasVacaciones,
      configuracionColumnasDetallesVacacion,
      tabOptions: tabOptionsVacaciones,
      maskFecha,
      modales,

      // listados
      empleados,
      periodos,

      //funciones
      filtrar,
      guardado,
      checkOptoPago,

      // botones de tabla
      btnAgregarDetalle,
      btnEditarDetalle
    }
  }
})
