// Dependencias
import { configuracionColumnasEmpleados } from '../domain/configuracionColumnasEmpleados'
import { configuracionColumnasExamenes } from '../domain/configuracionColumnasExamenes'
import { computed, defineComponent, ref } from 'vue'

// Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import DetallePaciente from './DetallePaciente.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesGestionPaciente } from '../application/ComportamientoModalesGestionPaciente'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { estadosExamenes, tabOptionsEstadosExamenes } from 'config/utils/medico'
import { useExamenes } from '../application/UseExamenes'
import { accionesTabla } from 'config/utils'
import { useBotonesSolicitudExamen } from '../application/UseBotonesSolicitudExamen'
import { useNotificaciones } from 'shared/notificaciones'
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useMedicoStore } from 'stores/medico'

export default defineComponent({
  components: { TabLayout, SelectorImagen, ModalesEntidad, EssentialTable, DetallePaciente, EssentialTableTabs },
  setup() {
    /*********
     * Stores
     *********/
    const medicoStore = useMedicoStore()
    // useNotificacionStore().setQuasar(useQuasar())
    // useCargandoStore().setQuasar(useQuasar())

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController())
    const { entidad: empleado } = mixin.useReferencias()
    const { onConsultado } = mixin.useHooks()
    const notificaciones = useNotificaciones()

    const listadoExamenes = ref([])

    // const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController())

    const tabs = ref('1')
    const tabEstadoExamen = ref(estadosExamenes.PENDIENTE_SOLICITAR)

    const modales = new ComportamientoModalesGestionPaciente()


    /*************
     * Funciones
     *************/
    const { examenes, registros, consultarRegistrosEmpleadoExamen, consultarExamenesSinSolicitar, consultarExamenesSolicitados } = useExamenes()
    const {
      // Referencias
      refTablaExamenes,
      seleccionVariosExamen,
      examenesSeleccionados,
      // Header
      btnSeleccionarVariosExamenes,
      btnSolicitarExamenesSeleccionados,
      btnCancelarSeleccionarVariosExamenes,
      // Body
      btnSolicitarExamenIndividual,
      btnResultados,
      // Other functions
      seleccionarExamen,
    } = useBotonesSolicitudExamen(tabEstadoExamen, modales)

    const filtrarEstadoExamen = (tab) => {
      tabEstadoExamen.value = tab
      if (tab === '0') {
        // seleccionVariosExamen.value = false
        consultarExamenesSinSolicitar({ empleado_id: empleado.id })
      } else {
        // seleccionVariosExamen.value = true
        examenesSeleccionados.value = []
        consultarExamenesSolicitados(tab)
      }
    }

    const agregarRegistro = () => {
      const config: CustomActionPrompt = {
        titulo: 'Motivo',
        mensaje: 'Ingrese una observación.',
        accion: async (motivo) => {
          try {
            notificaciones.notificarCorrecto('Registro agregado exitosamente!')
          } catch (error: any) {
            if (isAxiosError(error)) {
              const mensajes: string[] = error.erroresValidacion
              notificarMensajesError(mensajes, notificaciones)
            } else {
              notificaciones.notificarError(error.message)
            }
          }
        },
      }

      notificaciones.prompt(config)
    }



    /*******
     * Init
     *******/
    onConsultado(async () => {
      medicoStore.empleado = empleado
      await consultarRegistrosEmpleadoExamen({ empleado_id: empleado.id })
      await consultarExamenesSinSolicitar({ empleado_id: empleado.id })
    })

    const btnSolicitarExamenesSeleccionados2: CustomActionTable = {
      titulo: '22222',
      icono: 'bi-plus',
      color: 'positive',
      visible: () => seleccionVariosExamen.value,
      accion: async function () {
        // seleccionVariosExamen.value = false
        console.log(refTablaExamenes.value)
        refTablaExamenes.value.seleccionar()
        // seleccionarExamen()
      }
    }

    const refTablaExamenes2 = ref()
    function selecc() {
      const lista = refTablaExamenes2.value.selected
      console.log(lista)
    }

    return {
      selecc,
      mixin,
      empleado,
      tabs,
      tabsRegistro: ref('1'),
      tabEstadoExamen,
      configuracionColumnas: configuracionColumnasEmpleados,
      configuracionColumnasExamenes,
      tabOptionsEstadosExamenes,
      listadoExamenes,
      filtrarEstadoExamen,
      splitterModel: ref(14),
      accionesTabla,
      modales,
      examenes,
      registros,
      tipoSeleccion: computed(() => seleccionVariosExamen.value && tabEstadoExamen.value === '0' ? 'multiple' : 'none'),
      // funciones
      agregarRegistro,
      /*******************
       * Botones examenes
       *******************/
      // Referencias
      refTablaExamenes,
      seleccionVariosExamen,
      // Header
      btnSeleccionarVariosExamenes,
      btnSolicitarExamenesSeleccionados,
      btnCancelarSeleccionarVariosExamenes,
      // Body
      btnSolicitarExamenIndividual,
      btnResultados,
      // Other functions
      seleccionarExamen,
      btnSolicitarExamenesSeleccionados2,
    }
  },
})
