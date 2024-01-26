// Dependencias
import { configuracionColumnasEmpleados } from '../domain/configuracionColumnasEmpleados'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'
import { defineComponent, ref } from 'vue'
// import {tabOptionsEstadosExamenes} from ''
//import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import DetallePaciente from './DetallePaciente.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from '../infraestructure/EmpleadoController'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { DetalleExamen } from '../domain/DetalleExamen'
import { tabOptionsEstadosExamenes } from 'config/utils/medico'
import { configuracionColumnasExamenes } from '../domain/configuracionColumnasExamenes'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useExamenes } from '../application/UseExamenes'
import { accionesTabla } from 'config/utils'
import { ComportamientoModalesGestionPaciente } from '../application/ComportamientoModalesGestionPaciente'

export default defineComponent({
  components: { TabLayout, SelectorImagen, ModalesEntidad, EssentialTable, DetallePaciente, EssentialTableTabs },
  setup() {
    /*********
     * Stores
     *********/
    // useNotificacionStore().setQuasar(useQuasar())
    // useCargandoStore().setQuasar(useQuasar())

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController())
    const { entidad: empleado } = mixin.useReferencias()

    const listadoExamenes = ref([])

    // const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController())

    const tabs = ref('1')
    const tabEstadoExamen = ref('0')

    const registroExamenes: any[] = [
      {
        categoria: 'HEMATOLOGIA',
        examenes: [
          {
            tipo_examen: 'Examenes comunes',
            // categoria_examen: 'HEMATOLOGIA',
            examen: 'GRUPO SANGUINEO',
            estado: 1,
            seleccionado: false,
          },
          {
            tipo_examen: 'Examenes comunes',
            // categoria_examen: 'HEMATOLOGIA',
            examen: 'BIOMETRIA',
            estado: 1,
            seleccionado: false,
          },
        ],
      },
    ]

    const estadosExamenes = [
      {
        id: 1,
        nombre: 'SOLICITADO',
      },
      {
        id: 2,
        nombre: 'APROBADO POR COMPRAS',
      },
      {
        id: 3,
        nombre: 'DIAGNOSTICO REALIZADO',
      },
      {
        id: 4,
        nombre: 'APERTURA DE FICHA MEDICA',
      },
    ]

    const modales = new ComportamientoModalesGestionPaciente()

    /*************
     * Funciones
     *************/
    const { examenes, consultarExamenes, consultarExamenesSolicitados } = useExamenes()

    const filtrarEstadoExamen = (tab) => {
      console.log(tab)
      tabEstadoExamen.value = tab
      if (tab === '0') consultarExamenes()
      else consultarExamenesSolicitados(tab)
    }

    const btnSolicitar: CustomActionTable = {
      titulo: 'Solicitar examen',
      icono: 'bi-plus',
      color: 'positive',
      visible: ({ entidad }) => tabEstadoExamen.value === '0',
      accion: ({ entidad }) => {
        /*confirmar('¿Está seguro de ejecutar el ticket?', async () => {
          const { response, result } = await cambiarEstadoTicket.ejecutar(entidad.id)
          entidad.estado = estadosTickets.EJECUTANDO
          entidad.fecha_hora_ejecucion = result.fecha_hora_ejecucion
          filtrarTickets(estadosTickets.EJECUTANDO)
          notificarCorrecto(response.data.mensaje)
        })*/
      }
    }

    const btnResultados: CustomActionTable = {
      titulo: 'Resultados',
      icono: 'bi-list',
      color: 'primary',
      visible: ({ entidad }) => tabEstadoExamen.value === '1',
      accion: ({ entidad }) => {
        modales.abrirModalEntidad('ResultadosExamenPage')
        /*confirmar('¿Está seguro de ejecutar el ticket?', async () => {
          const { response, result } = await cambiarEstadoTicket.ejecutar(entidad.id)
          entidad.estado = estadosTickets.EJECUTANDO
          entidad.fecha_hora_ejecucion = result.fecha_hora_ejecucion
          filtrarTickets(estadosTickets.EJECUTANDO)
          notificarCorrecto(response.data.mensaje)
        })*/
      }
    }

    /*******
     * Init
     *******/
    consultarExamenes()

    return {
      mixin,
      empleado,
      tabs,
      tabsRegistro: ref('1'),
      tabEstadoExamen,
      configuracionColumnas: configuracionColumnasEmpleados,
      configuracionColumnasExamenes,
      registroExamenes,
      estadosExamenes,
      tabOptionsEstadosExamenes,
      listadoExamenes,
      filtrarEstadoExamen,
      splitterModel: ref(10),
      accionesTabla,
      modales,
      examenes,
      // botones tabla
      btnSolicitar,
      btnResultados,
    }
  },
})
