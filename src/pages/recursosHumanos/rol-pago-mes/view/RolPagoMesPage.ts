// Dependencias
import { configuracionColumnasRolPago } from '../../rol-pago/domain/configuracionColumnasRolPago'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, Ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RolPagoController } from '../../rol-pago/infraestructure/RolPagoController'
import { RolPago } from '../../rol-pago/domain/RolPago'
import { removeAccents } from 'shared/utils'
import { acciones, accionesTabla } from 'config/utils'
import { configuracionColumnasRolPagoTabla } from '../../rol-pago/domain/configuracionColumnasRolPagoTabla'
import { ConceptoIngreso } from 'pages/recursosHumanos/concepto_ingreso/domain/ConceptoIngreso'
import { useAuthenticationStore } from 'stores/authentication'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'
import { RolPagoMes } from '../domain/RolPagoMes'
import { RolPagoMesController } from '../infrestucture/RolPagoMesController'
import { ComportamientoModalesRolPagoMes } from '../aplication/ComportamientoModalesRolPagoMes'
import { ComportamientoModalesRolPago } from 'pages/recursosHumanos/rol-pago/aplication/ComportamientoModalesRolPago'
import { RolPagoMesModales } from '../domain/RolPagoMesModales'
import {
  tabOptionsEstadosRolPago,
  tabOptionsEstadosRolPagoEmpleado,
} from 'config/recursosHumanos.utils'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useBotonesTablaRolPagoMes } from '../aplication/BotonesTablaRolPagoMes'
import { useRolPagoStore } from 'stores/rolPago'
import { useNotificaciones } from 'shared/notificaciones'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { configuracionColumnasRolPagoMes } from '../domain/configuracionColumnasRolPagoMes'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import { useBotonesTablaRolPago } from 'pages/recursosHumanos/rol-pago/aplication/BotonesTablaRolPago'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

export default defineComponent({
  components: {
    TabLayoutFilterTabs2,
    ModalesEntidad,
    SelectorImagen,
    EssentialTable,
    EssentialTableTabs,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      RolPagoMes,
      new RolPagoMesController()
    )
    const {
      entidad: rolpago,
      disabled,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const {
      guardar,
      editar,
      eliminar,
      reestablecer,
      setValidador,
      obtenerListados,
      cargarVista,
      listar,
    } = mixin.useComportamiento()
    const mixinRolEmpleado = new ContenedorSimpleMixin(
      RolPago,
      new RolPagoController()
    )
    const { listado: roles_empleados } = mixinRolEmpleado.useReferencias()
    const { listar: listarRolEmpleado } = mixinRolEmpleado.useComportamiento()

    /**********
     * Modales
     **********/
    const modalesRolPagoMes = new ComportamientoModalesRolPagoMes()
    const modalesRolPago = new ComportamientoModalesRolPago()

    const { onConsultado } = mixin.useHooks()
    useCargandoStore().setQuasar(useQuasar())
    const { notificarAdvertencia, prompt, confirmar } = useNotificaciones()

    const { btnFinalizarRolPago } = useBotonesTablaRolPagoMes(mixin)
    const { btnIniciar, btnRealizar, btnCancelar,btnImprimir } = useBotonesTablaRolPago(
      roles_empleados,
      modalesRolPago,
      listadosAuxiliares
    )
    const rolPagoStore = useRolPagoStore()
    const tabActual = ref()

    const btnAgregarRolPagoEmpleado: CustomActionTable = {
      titulo: 'Agregar rol pago empleado',
      icono: 'bi-plus',
      color: 'positive',
      accion: () => {
        console.log('agregar rol de pagos');

        if (!rolpago.id)
          return notificarAdvertencia('Primero debe seleccionar una tarea.')
        if (rolpago.finalizado)
          return notificarAdvertencia(
            'No puede agregar más subtareas porque la tarea ha finalizado.'
          )
        rolPagoStore.idRolPagoMes = rolpago.id
        rolPagoStore.accion = acciones.nuevo
        rolPagoStore.idRolPagoSeleccionada = null
        modalesRolPago.abrirModalEntidad('RolPagoPage')
      },
    }

    const btnConsultarRolPagoEmpleado: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      accion: ({ entidad }) => {
        rolPagoStore.idRolPagoSeleccionada = entidad.id
        rolPagoStore.accion = acciones.consultar
        modalesRolPago.abrirModalEntidad('RolPagoPage')
      },
    }
    let tabActualRolPago = '0'
    function filtrarRolPagoMes(tabSeleccionado: string) {
      listar({ finalizado: tabSeleccionado }, false)
      tabActualRolPago = tabSeleccionado
    }
    function filtrarRolPagoEmpleado(estado) {
      listarRolEmpleado({ rol_pago_id: rolpago.id, estado: estado })
      tabActual.value = estado
    }

    const concepto_ingresos: Ref<ConceptoIngreso[]> = ref([])
    const es_consultado = ref(false)
    const tipo = ref(1)
    const es_calculable = ref(true)
    const campo = ref()
    const is_month = ref(false)
    const tab = ref('rol_pago')

    onConsultado(() => filtrarRolPagoEmpleado(''))

    //Reglas de validacion
    const reglas = {
      mes: { required },
      nombre: { required },
    }
    const v$ = useVuelidate(reglas, rolpago)
    setValidador(v$.value)
    async function guardado(paginaModal: keyof RolPagoMesModales) {
      switch (paginaModal) {
        case 'RolPagoMesPage':
          const { result } = await new RolPagoMesController().listar()
          listadosAuxiliares.rolpago = result
          roles_empleados.value = result
          break
        case 'RolPagoPage':
          break
      }
      modalesRolPagoMes.cerrarModalEntidad()
    }

    const store = useAuthenticationStore()

    const esRecursosHumanos = store.esRecursosHumanos

    /**Verifica si es un mes */
    function checkValue(val, reason, details) {
      is_month.value = reason === 'month' ? false : true
    }

    return {
      removeAccents,
      mixin,
      rolpago,
      concepto_ingresos,
      campo,
      is_month,
      tipo,
      tab,
      es_consultado,
      btnIniciar,
      btnRealizar,
      btnCancelar,
      btnImprimir,
      btnConsultarRolPagoEmpleado,
      btnAgregarRolPagoEmpleado,
      roles_empleados,
      checkValue,
      modalesRolPagoMes,
      modalesRolPago,
      guardado,
      es_calculable,
      v$,
      filtrarRolPagoMes,
      filtrarRolPagoEmpleado,
      disabled,
      configuracionColumnasRolPago,
      columnasRolPagoEmpleados: [
        ...configuracionColumnasRolPago,
        accionesTabla,
      ],
      indicatorColor: computed(() =>
        rolpago.tiene_empleados ? 'primary' : 'white'
      ),
      tabOptionsEstadosRolPagoEmpleado,
      tabOptionsEstadosRolPago,
      btnFinalizarRolPago,
      configuracionColumnas: configuracionColumnasRolPagoMes,
      accionesTabla,
    }
  },
})
