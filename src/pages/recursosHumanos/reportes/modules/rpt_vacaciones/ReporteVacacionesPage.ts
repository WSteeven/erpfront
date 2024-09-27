import { AxiosResponse } from "axios";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import ModalEntidad from "components/modales/view/ModalEntidad.vue";
import EssentialTable from "components/tables/view/EssentialTable.vue";
import { apiConfig, endpoints } from "config/api";
import { maskFecha } from "config/utils";
import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { PeriodoController } from "pages/recursosHumanos/periodo/infraestructure/PeriodoController";
import { useQuasar } from "quasar";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { useNotificaciones } from "shared/notificaciones";
import { imprimirArchivo, ordenarLista } from "shared/utils";
import { useAuthenticationStore } from "stores/authentication";
import { useCargandoStore } from "stores/cargando";
import { useNotificacionStore } from "stores/notificacion";
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  components: {EssentialTable, ModalEntidad},
  setup() {
    const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController())
    const { listadosAuxiliares } = mixin.useReferencias()
    const { obtenerListados, cargarVista } = mixin.useComportamiento()
    const { notificarError, notificarAdvertencia } = useNotificaciones()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    const cargando = new StatusEssentialLoading()
    const store = useAuthenticationStore()
    const listado = ref([])
    const periodos = ref([])
    const reporte = reactive({
      empleado: null,
      tipo: null,
      fecha_inicio: '',
      fecha_fin: '',
      fecha_corte: '',
      solicitante: null,
      per_atiende: null,
      sucursal: null,
      motivo: null,
      devolucion: null,
      todos: false,
      tarea: null,
      transferencia: null,
      accion: '',
    })
    const {empleados, filtrarEmpleados} = useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async()=>{
      await obtenerListados({
        periodos: {controller: new PeriodoController(), params:{activo:1}},
        empleados: {controller: new EmpleadoController(), params:{estado:1}},
      })

      periodos.value = listadosAuxiliares.periodos
      empleados.value = listadosAuxiliares.empleados
    })

    async function buscarReporte(accion: string) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        let url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.vacacion) + '/reporte'
        const filename = 'reporte_ingresos_bodega'
        switch (accion) {
          case 'excel':
            reporte.accion = 'excel'
            imprimirArchivo(url, 'POST', 'blob', 'xlsx', filename, reporte)

            break
          case 'pdf':
            reporte.accion = 'pdf'
            cargando.activar()
            imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, reporte)
            cargando.desactivar()
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

    // Se calcula según el periodo las vacaciones de un empleado
    // Para todos los empleados, en dicho periodo se hace un barrido de los días de permiso dados con descuento a vacaciones
    // Se toma los registros de la tabla vacaciones para obtener las vacaciones ya gozadas por un empleado...
    // Se debe registrar las vacaciones o los días de vacaciones para cada que se saque un corte de vacaciones faltantes o tomadas, se vea para todos los empleados las mismas




    return {
      mixin,
      reporte,
      store,
      maskFecha,

      // listados
      listado,
      periodos,
      empleados, filtrarEmpleados,

      // funciones
      buscarReporte,
      ordenarLista,
    }
  },
})
