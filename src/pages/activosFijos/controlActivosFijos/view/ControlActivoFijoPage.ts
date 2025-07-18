// Dependencias
import { configuracionColumnasEntregasActivosFijos } from '../domain/configuracionColumnasEntregasActivosFijos'
import { configuracionColumnasSeguimientoConsumo } from '../domain/configuracionColumnasSeguimientoConsumo'
import { configuracionColumnasStockResponsables } from '../domain/configuracionColumnasStockResponsables'
import { configuracionColumnasActivosFijos } from '../domain/configuracionColumnasActivosFijos'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { computed, defineComponent, onMounted, reactive, Ref, ref, UnwrapRef } from 'vue'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { opcionesConsultasActivosFijos } from 'config/utils/activos_fijos'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { accionesTabla } from 'config/utils'
import { iconos } from 'config/iconos'
import { endpoints } from 'config/api'
import { useQuasar } from 'quasar'

// Componentes
import FormularioPermisoArma from 'src/pages/bodega/permisosArmas/view/FormularioPermisoArma.vue'
import EssentialTablePagination from 'components/tables/view/EssentialTablePagination.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SolicitarArchivo from 'shared/prompts/SolicitarArchivo.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import Callout from 'components/CalloutComponent.vue'

// Logica y controladores
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransaccionController } from 'pages/bodega/transacciones/infraestructure/TransaccionController'
import { useConsultarOpcionesActivosFijos } from '../application/ConsultarOpcionesActivosFijos'
import { ActivoFijoController } from '../infraestructure/ActivoFijoController'
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion'
import { ActivoFijo } from '../domain/ActivoFijo'
import {imprimirArchivo} from 'shared/utils';
import {useCargandoStore} from 'stores/cargando';

declare global {
  interface Window {
    qz: {
      websocket: {
        connect: () => Promise<void>;
        disconnect: () => Promise<void>;
      };
      configs: {
        create: (printerName: string) => any;
      };
      print: (config: any, data: { type: string; data: string }[]) => Promise<void>;
      printers: {
        find: () => Promise<string[]>; // Método para obtener la lista de impresoras
      };
    };
  }
}

export default defineComponent({
  components: { TabLayout, SelectorImagen, FormularioPermisoArma, EssentialTable, EssentialTablePagination, SolicitarArchivo, Callout },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(ActivoFijo, new ActivoFijoController())
    const { entidad: activo, disabled, accion, listado, tabs } = mixin.useReferencias()
    const { onConsultado } = mixin.useHooks()
    const { listar, editarParcial } = mixin.useComportamiento()

    const mixinTransaccion = new ContenedorSimpleMixin(Transaccion, new TransaccionController(), new ArchivoController())
    const { entidad: transaccion } = mixinTransaccion.useReferencias()

    /************
     * Variables
     ************/
    const { prompt, notificarCorrecto, notificarError, notificarAdvertencia, notificarInformacion } = useNotificaciones()
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
    const impresoras: Ref<string[]> = ref([])
    const impresoraSeleccionada = ref()
    // const mostrarArchivoSeguimiento = ref(false)

    /************
     * Funciones
     ************/
    const { entregas, listarEntregas, asignacionesProductos, listarStockResponsablesAF, seguimientosConsumosActivosFijos, listarSeguimientoConsumoActivosFijos, mixinSeguimientosConsumosActivosFijos } = useConsultarOpcionesActivosFijos()

    // Método para generar la etiqueta
    const generateLabel = async (idActivoFijo: number, custom=false, data?:any): Promise<void> => {
      try {
        const axios = AxiosHttpRepository.getInstance()
        const ruta = custom? axios.getEndpoint(endpoints.imprimir_etiqueta_personalizada): axios.getEndpoint(endpoints.activos_fijos) + '-imprimir-etiqueta/' + idActivoFijo
        const response: any = custom ? await axios.post(ruta,data ) : await  axios.get(ruta)
        await printLabel(response.data)
      } catch (error) {
        // console.error('Error al generar la etiqueta:', error)
        notificarError('Error al generar la etiqueta: ' + error)
      }
    };

    const obtenerImpresoras = async () => {
      try {
        // Obtener la lista de impresoras disponibles
        if (!window.qz) return notificarAdvertencia('qZ Tray no está disponible')
        await window.qz.websocket.connect()
        const printers: string[] = await window.qz.printers.find();
        impresoras.value = printers
        await window.qz.websocket.disconnect();
      } catch (error) {
        console.error('Error al imprimir:', error);
        notificarError('Error al imprimir')
      }
    }

    // Método para imprimir usando qZ Tray
    const printLabel = async (zpl: string): Promise<void> => {
      try {
        if (!impresoraSeleccionada.value) {
          return notificarAdvertencia('Seleccione una impresora')
        }

        if (!window.qz) return notificarAdvertencia('qZ Tray no está disponible')
        await window.qz.websocket.connect()
        const config = window.qz.configs.create(impresoraSeleccionada.value) // Ajusta el nombre de tu impresora - Zebra GK420t
        // const config = window.qz.configs.create('ZDesigner GK420t'); // Ajusta el nombre de tu impresora - Zebra GK420t
        await window.qz.print(config, [{ type: 'raw', data: zpl + '\n' }])
        await window.qz.websocket.disconnect()
        notificarInformacion('Etiqueta enviada a impresión')
      } catch (error) {
        console.error('Error al imprimir:', error)
        notificarError('Error al imprimir')
      }
    }

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

    const btnDescargarReporte: CustomActionTable = {
      titulo: 'Descargar reporte',
      icono: 'bi-table',
      color: 'positive',
      accion: async () => {
        listar({ export: 'xlsx', titulo: 'reporte_activos_fijos' })
      }
    }

    const btnEditarCodigoPersonalizado: CustomActionTable<ActivoFijo> = {
      titulo: 'Código personalizado',
      icono: iconos.editar,
      color: 'teal-7',
      accion: async ({ entidad, posicion }) => {
        const data: CustomActionPrompt = {
          titulo: 'Editar código',
          mensaje: 'Ingresa el nuevo código personalizado',
          defecto: listado.value[posicion].codigo_personalizado,
          accion: async (nuevoCodigo: number) => {
            editarParcial(entidad.id, { codigo_personalizado: nuevoCodigo })
          }
        }
        prompt(data)
      }
    }

    const btnEditarCodigoSistemaAnterior: CustomActionTable = {
      titulo: 'Código sistema anterior',
      icono: iconos.editar,
      color: 'teal-9',
      accion: async ({ entidad, posicion }) => {
        const data: CustomActionPrompt = {
          titulo: 'Editar código',
          mensaje: 'Ingresa el nuevo código sistema anterior',
          defecto: listado.value[posicion].codigo_sistema_anterior,
          accion: async (nuevoCodigo: number) => {
            editarParcial(entidad.id, { codigo_sistema_anterior: nuevoCodigo })
          }
        }
        prompt(data)
      }
    }

    const btnDescargarEtiqueta: CustomActionTable = {
      titulo: 'Imprimir etiqueta',
      icono: iconos.imprimir,
      color: 'blue-grey-8',
      accion: async ({ entidad }) => {
        await generateLabel(entidad.id)
      }
    }

    const btnDescargarEtiquetaPersonalizada: CustomActionTable =  {
      titulo: 'Imprimir etiqueta',
      icono: iconos.imprimir,
      color: 'blue-grey-8',
      accion: async ({ entidad }) => {
        await generateLabel(entidad.id, true, {...entidad, ...filtros})
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
    onMounted(() => tabs.value = 'listado')

    // inicializarQZ().then(() =>
    obtenerImpresoras()

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
      btnDescargarReporte,
      btnDescargarEtiqueta,
      btnDescargarEtiquetaPersonalizada,
      // consultarStockResponsables,
      asignacionesProductos,
      listarStockResponsablesAF,
      filtros,
      mostrarSolicitarArchivoActaEntregaRecepcion,
      tipoArchivo,
      mixinSeguimientosConsumosActivosFijos,
      btnEditarCodigoPersonalizado,
      btnEditarCodigoSistemaAnterior,
      impresoraSeleccionada,
      impresoras,
      obtenerImpresoras,
      iconos,
    }
  }
})
