// Dependencias
import { configuracionColumnasEntregasActivosFijos } from '../domain/configuracionColumnasEntregasActivosFijos'
import { configuracionColumnasSeguimientoConsumo } from '../domain/configuracionColumnasSeguimientoConsumo'
import { configuracionColumnasStockResponsables } from '../domain/configuracionColumnasStockResponsables'
import { configuracionColumnasActivosFijos } from '../domain/configuracionColumnasActivosFijos'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { opcionesConsultasActivosFijos } from 'config/utils/activos_fijos'
import { computed, defineComponent, reactive, ref, UnwrapRef } from 'vue'
import { useAuthenticationStore } from 'stores/authentication'
import { useActivoFijoStore } from 'stores/activo_fijo'
import { accionesTabla } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import FormularioPermisoArma from 'src/pages/bodega/permisosArmas/view/FormularioPermisoArma.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialTablePagination from 'components/tables/view/EssentialTablePagination.vue'
import SolicitarArchivo from 'shared/prompts/SolicitarArchivo.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useConsultarOpcionesActivosFijos } from '../application/ConsultarOpcionesActivosFijos'
import { ActivoFijoController } from '../infraestructure/ActivoFijoController'
import { ActivoFijo } from '../domain/ActivoFijo'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { TransaccionController } from 'pages/bodega/transacciones/infraestructure/TransaccionController'
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'

export default defineComponent({
  components: { TabLayout, SelectorImagen, FormularioPermisoArma, EssentialTable, EssentialTablePagination, SolicitarArchivo },
  setup() {
    /*********
     * Stores
     *********/
    const activoFijoStore = useActivoFijoStore()
    const authenticationStore = useAuthenticationStore()
    useNotificacionStore().setQuasar(useQuasar())

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(ActivoFijo, new ActivoFijoController())
    const { entidad: activo, disabled, accion } = mixin.useReferencias()
    const { onConsultado } = mixin.useHooks()

    const mixinTransaccion = new ContenedorSimpleMixin(Transaccion, new TransaccionController(), new ArchivoController())
    const { entidad: transaccion } = mixinTransaccion.useReferencias()

    /************
     * Variables
     ************/
    const tabsOpcionesConsultas = ref()
    const sumaCantidadesEntregadas = computed(() => entregas.value.reduce((acc, entrega: ActivoFijo) => {
      return acc + (entrega.cantidad ?? 0)
    }, 0))
    const filtros: UnwrapRef<any> = reactive({
      detalle_producto_id: null,
      cliente_id: null,
    })
    // const mostrarSolicitarArchivoJustificativoUso = ref(false)
    const mostrarSolicitarArchivoActaEntregaRecepcion = ref(false)
    const tiposArchivos = {
      ACTA_ENTREGA_RECEPCION: 'ACTA ENTREGA RECEPCION',
      JUSTIFICATIVO_USO: 'JUSTIFICATIVO USO',
    }
    const tipoArchivo = ref()

    /************
     * Funciones
     ************/
    const { entregas, listarEntregas, asignacionesProductos, listarStockResponsablesAF, seguimientosConsumosActivosFijos, listarSeguimientoConsumoActivosFijos, mixinSeguimientosConsumosActivosFijos } = useConsultarOpcionesActivosFijos()

    /******************
     * Acciones tabla
     ******************/
    const btnSubirActaEntregaRecepcion: CustomActionTable = {
      titulo: 'Subir acta de entrega recepción',
      icono: 'bi-upload',
      color: 'primary',
      accion: ({ entidad }) => {
        transaccion.hydrate(entidad)
        tipoArchivo.value = tiposArchivos.ACTA_ENTREGA_RECEPCION
        mostrarSolicitarArchivoActaEntregaRecepcion.value = true
      }
    }

    const btnSubirJustificativoUso: CustomActionTable = {
      titulo: 'Justificativo de uso',
      icono: 'bi-upload',
      color: 'blue-grey',
      accion: ({ entidad }) => {
        transaccion.hydrate(entidad)
        tipoArchivo.value = tiposArchivos.JUSTIFICATIVO_USO
        mostrarSolicitarArchivoActaEntregaRecepcion.value = true
      }
    }

    /************
     * Observers
     ************/
    /* const consultarStockResponsables = () => {
      //
    } */

    /********
     * Hooks
     ********/
    onConsultado(() => {
      filtros.cliente_id = activo.cliente_id
      filtros.detalle_producto_id = activo.detalle_producto.id
      tabsOpcionesConsultas.value = opcionesConsultasActivosFijos.ENTREGAS
      listarEntregas(filtros)
    })

    /*******
     * Init
     *******/
    tabsOpcionesConsultas.value = opcionesConsultasActivosFijos.ENTREGAS

    return {
      mixin, activo, disabled, accion,
      mixinTransaccion,
      configuracionColumnas: configuracionColumnasActivosFijos,
      configuracionColumnasEntregasActivosFijos,
      configuracionColumnasStockResponsables,
      configuracionColumnasSeguimientoConsumo,
      accionesTabla,
      sumaCantidadesEntregadas,
      opcionesConsultasActivosFijos,
      tabsOpcionesConsultas,
      entregas,
      seguimientosConsumosActivosFijos,
      listarSeguimientoConsumoActivosFijos,
      listarEntregas,
      btnSubirActaEntregaRecepcion,
      btnSubirJustificativoUso,
      // consultarStockResponsables,
      asignacionesProductos,
      listarStockResponsablesAF,
      filtros,
      mostrarSolicitarArchivoActaEntregaRecepcion,
      tipoArchivo,
      mixinSeguimientosConsumosActivosFijos,
    }
  }
})
