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
    const { seleccionVariosExamen, btnSolicitar, btnResultados, btnSeleccionarVariosExamenes, btnSolicitarExamenesSeleccionados } = useBotonesSolicitudExamen(tabEstadoExamen, modales)

    const filtrarEstadoExamen = (tab) => {
      tabEstadoExamen.value = tab
      if (tab === '0') {
        // seleccionVariosExamen.value = false
        consultarExamenesSinSolicitar({ empleado_id: empleado.id })
      } else {
        // seleccionVariosExamen.value = true
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
      await consultarRegistrosEmpleadoExamen({ empleado_id: empleado.id })
      await consultarExamenesSinSolicitar({ empleado_id: empleado.id })
    })

    return {
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
      seleccionVariosExamen,
      // funciones
      agregarRegistro,
      // botones tabla
      btnSolicitar,
      btnResultados,
      // botones tabla header
      btnSeleccionarVariosExamenes,
      btnSolicitarExamenesSeleccionados,
    }
  },
})
