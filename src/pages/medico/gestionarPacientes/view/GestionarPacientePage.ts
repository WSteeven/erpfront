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
import { estadosExamenes, tabOptionsEstadosExamenes, tiposProcesosExamenes } from 'config/utils/medico'
import { useBotonesSolicitudExamen } from '../application/UseBotonesSolicitudExamen'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { useExamenes } from '../application/UseExamenes'
import { useMedicoStore } from 'stores/medico'
import { accionesTabla } from 'config/utils'

export default defineComponent({
  components: { TabLayout, SelectorImagen, ModalesEntidad, EssentialTable, DetallePaciente, EssentialTableTabs },
  setup() {
    /*********
     * Stores
     *********/
    const medicoStore = useMedicoStore()

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController())
    const { entidad: empleado } = mixin.useReferencias()
    const { onConsultado } = mixin.useHooks()
    const notificaciones = useNotificaciones()

    const listadoExamenes = ref([])

    const tabs = ref(tiposProcesosExamenes.INGRESO)
    const tabEstadoExamen = ref(estadosExamenes.PENDIENTE_SOLICITAR)
    const tabsRegistro = ref(1)

    const modales = new ComportamientoModalesGestionPaciente()

    /*************
     * Funciones
     *************/
    const { examenes, registros, consultarRegistrosEmpleadoExamen, consultarExamenesSinSolicitar, consultarExamenesSolicitados, guardarRegistro } = useExamenes()
    const {
      // Referencias
      refTablaExamenes,
      seleccionVariosExamen,
      examenesSeleccionados,
      // Header
      btnSeleccionarVariosExamenes,
      btnSolicitarExamenesSeleccionados,
      btnCancelarSeleccionarVariosExamenes,
      btnNuevoDiagnostico,
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
        consultarExamenesSinSolicitar({ empleado_id: empleado.id, registro_empleado_examen_id: tabsRegistro.value })
      } else {
        // seleccionVariosExamen.value = true
        examenesSeleccionados.value = []
        consultarExamenesSolicitados(tab, tabsRegistro.value)
      }
    }

    const agregarRegistro = () => {
      const config: CustomActionPrompt = {
        titulo: 'Motivo',
        mensaje: 'Ingrese una observación.',
        accion: async (motivo) => {
          try {
            if (empleado.id) guardarRegistro(motivo, empleado.id, tabs.value)
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

    const seleccionarRegistro = (registro: number) => {
      medicoStore.idRegistroEmpleadoExamen = registro
      examenes.value = []
      tabEstadoExamen.value = estadosExamenes.PENDIENTE_SOLICITAR
      consultarExamenesSinSolicitar({ empleado_id: empleado.id, registro_empleado_examen_id: registro })
    }

    const actualizarListadoExamenes = ({ detalle_resultado_examen, page }) => {
      let index, examen
      switch (page) {
        case 'SolicitudExamenPage':
          index = examenes.value.findIndex((examen) => examen.id === detalle_resultado_examen)
          examen = examenes.value[index]
          examenes.value.splice(index, 1)
          break
        default:
          console.log('se guardo modal...')
          console.log(detalle_resultado_examen)
          console.log(examenes.value)
          index = examenes.value.findIndex((examen) => examen.id === medicoStore.examenSolicitado?.id)
          examen = examenes.value[index]
          examen.detalle_resultado_examen = detalle_resultado_examen
          examenes.value.splice(index, 1, examen)
      }
    }

    /*******
     * Init
     *******/
    onConsultado(async () => {
      medicoStore.empleado = empleado
      await consultarRegistrosEmpleadoExamen({ empleado_id: empleado.id })
      await consultarExamenesSinSolicitar({ empleado_id: empleado.id, registro_empleado_examen_id: tabsRegistro.value })
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
      tabsRegistro,
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
      tiposProcesosExamenes,
      tipoSeleccion: computed(() => seleccionVariosExamen.value && tabEstadoExamen.value === '0' ? 'multiple' : 'none'),
      // funciones
      agregarRegistro,
      seleccionarRegistro,
      actualizarListadoExamenes,
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
      btnNuevoDiagnostico,
      // Body
      btnSolicitarExamenIndividual,
      btnResultados,
      // Other functions
      seleccionarExamen,
      btnSolicitarExamenesSeleccionados2,
    }
  },
})
