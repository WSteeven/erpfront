//Dependencias
import { configuracionColumnasTransaccionEgreso } from 'pages/bodega/transacciones/domain/configuracionColumnasTransaccionEgreso';
import { defineComponent, reactive, ref } from 'vue';
import { LocalStorage, useQuasar, } from 'quasar';

//Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue';


//Logica y controladores
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { AxiosResponse } from 'axios'
import { apiConfig, endpoints } from 'config/api';
import { useNotificaciones } from 'shared/notificaciones';
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { TransaccionIngresoController } from 'pages/bodega/transacciones/infraestructure/TransaccionIngresoController';
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion';
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController';
import { accionesTabla, maskFecha, opcionesReportesEgresos, tiposReportesEgresos } from 'config/utils';
import { MotivoController } from 'pages/administracion/motivos/infraestructure/MotivoController';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import { useTransaccionEgresoStore } from 'stores/transaccionEgreso';
import { EmpleadoRoleController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoRolesController';
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController';
import { imprimirArchivo, ordenarLista } from 'shared/utils'
import { useNotificacionStore } from 'stores/notificacion';
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController';
import { ComportamientoModalesTransaccionEgreso } from 'pages/bodega/transacciones/modules/transaccionEgreso/application/ComportamientoModalesGestionarEgresos';
import { useCargandoStore } from 'stores/cargando';
import { CategoriaController } from 'pages/bodega/categorias/infraestructure/CategoriaController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';

ChartJS.register(ArcElement, Tooltip, Legend)
export default defineComponent({
  components: { EssentialTable, ModalEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionIngresoController())
    const { listadosAuxiliares } = mixin.useReferencias()
    const { obtenerListados, cargarVista } = mixin.useComportamiento()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()
    const modales = new ComportamientoModalesTransaccionEgreso()
    const reporte = reactive({
      tipo: null,
      fecha_inicio: '',
      fecha_fin: '',
      solicitante: null,
      per_retira: null,
      responsable: null,
      per_autoriza: null,
      per_atiende: null, //bodeguero
      sucursal: null,
      motivo: null,
      pedido: null,
      tarea: null,
      transferencia: null,
      firmada: true,
      categorias: null,
      accion: '',
    })

    const { notificarError, notificarAdvertencia } = useNotificaciones()
    const transaccionStore = useTransaccionEgresoStore()
    const listado = ref([])
    const bodegueros = ref([])
    const clientes = ref([])
    const empleados = ref([])
    const motivos = ref([])
    const tareas = ref([])
    const { categorias } = useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: new EmpleadoController(),
        motivos: { controller: new MotivoController(), params: { tipo_transaccion_id: 2 } },
      })
      listadosAuxiliares.categorias = []
    })



    /**
     * Funciones
     */
    function limpiarCampos() {
      reporte.solicitante = null
      reporte.sucursal = null
      reporte.responsable = null
      reporte.per_retira = null
      reporte.per_autoriza = null
      reporte.per_atiende = null
      reporte.motivo = null
      reporte.pedido = null
      reporte.tarea = null
      reporte.firmada = true
      reporte.transferencia = null
      reporte.accion = ''
    }
    async function buscarReporte(accion: string) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        let url = axios.getEndpoint(endpoints.transacciones_egresos) + '/reportes'
        const filename = 'reporte_egresos_bodega'
        switch (accion) {
          case 'excel':
            url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.transacciones_egresos) + '/reportes'
            reporte.accion = 'excel'
            imprimirArchivo(url, 'POST', 'blob', 'xlsx', filename, reporte)

            break
          case 'pdf':
            url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.transacciones_egresos) + '/reportes'
            reporte.accion = 'pdf'
            imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, reporte)
            break
          default:
            reporte.accion = ''
            const response: AxiosResponse = await axios.post(url, reporte)
            if (response.data.results) {
              listado.value = response.data.results
              if (response.data.results.length < 1) notificarAdvertencia('No se obtuvieron resultados')
            }
        }
        cargando.desactivar()
      } catch (e) {
        console.log(e)
        notificarError('Error al obtener reporte')
      } finally {
        cargando.desactivar()
      }
    }
    async function consultarListado(id: number) {
      limpiarCampos()
      if (id == tiposReportesEgresos.tarea && tareas.value.length == 0) {
        cargando.activar()
        const { response } = await new TareaController().listar({ campos: 'id,codigo_tarea,titulo,cliente_id' })
        cargando.desactivar()
        tareas.value = response.data.results
      }
      if (id == tiposReportesEgresos.bodeguero && bodegueros.value.length == 0) {
        cargando.activar()
        const { response } = await new EmpleadoRoleController().listar({ roles: ['BODEGA', 'ACTIVOS FIJOS'] })
        cargando.desactivar()
        bodegueros.value = response.data.results
      }
      if (id == tiposReportesEgresos.cliente && clientes.value.length == 0) {
        cargando.activar()
        const { response } = await new ClienteController().listar({ estado: 1, requiere_bodega: 1 })
        cargando.desactivar()
        clientes.value = response.data.results
      }
      if (id == tiposReportesEgresos.categorias) {
        cargando.activar()
        const { response } = await new CategoriaController().listar()
        cargando.desactivar()
        categorias.value = response.data.results
      }
    }
    /**
     * Botones de tabla
     */
    const botonVerTransaccion: CustomActionTable = {
      titulo: '',
      icono: 'bi-eye',
      color: 'primary',
      accion: async ({ entidad }) => {
        transaccionStore.idTransaccion = entidad.id
        await transaccionStore.showPreview()
        modales.abrirModalEntidad('VisualizarEgresoPage')
      }
    }


    //listados
    const sucursales = JSON.parse(LocalStorage.getItem('sucursales')!.toString())
    empleados.value = listadosAuxiliares.empleados
    motivos.value = listadosAuxiliares.motivos

    //agregar otra opcion
    sucursales.unshift({ id: 0, lugar: 'TODAS LAS SUCURSALES', })
    // autorizaciones.unshift({ id: 0, nombre: 'TODAS LAS AUTORIZACIONES', })





    const configuracionColumnas = [...configuracionColumnasTransaccionEgreso, accionesTabla]

    return {
      configuracionColumnas,
      reporte, maskFecha,
      //listados
      sucursales, listado,
      empleados, bodegueros, motivos,
      tareas, clientes,
      categorias,

      opcionesReportesEgresos,
      tiposReportesEgresos,
      //funciones
      buscarReporte,
      consultarListado,
      //botones
      botonVerTransaccion,
      modales,
      //filtro de empleados
      filtroEmpleados(val, update) {
        if (val === '') {
          update(() => {
            empleados.value = listadosAuxiliares.empleados
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          empleados.value = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
        })
      },

      ordenarLista,

    }
  }
})
