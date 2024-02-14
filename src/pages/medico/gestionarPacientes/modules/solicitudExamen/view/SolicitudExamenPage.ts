// Dependencias
import { useMedicoStore } from 'stores/medico'
import { Ref, computed, defineComponent, ref, watch } from 'vue'

// Componentes
import DetallePaciente from '../../../view/DetallePaciente.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EstadoSolicitudExamenController } from '../infraestructure/EstadoSolicitudExamenController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { ExamenController } from 'pages/medico/examenes/infraestructure/ExamenController'
import { EstadoSolicitudExamen } from '../domain/EstadoSolicitudExamen'
import { ExamenSolicitado } from '../domain/ExamenSolicitado'
import { Examen } from 'pages/medico/examenes/domain/Examen'
import { LaboratorioClinicoController } from 'pages/medico/laboratoriosMedicos/infraestructure/LaboratorioClinicoController'
// import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { maskFecha } from 'config/utils'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { LocalStorage } from 'quasar'
// import { medico } from 'config/endpoints/medico'

export default defineComponent({
  components: {
    DetallePaciente,
  },
  emits: ['guardado'],
  setup(props, { emit }) {
    const medicoStore = useMedicoStore()
    const empleado = medicoStore.empleado
    // const examen = medicoStore.examen
    const examenesSolicitados = medicoStore.examenesSolicitados

    const cargando = new StatusEssentialLoading()
    const laboratorioClinicoController = new LaboratorioClinicoController()
    const examenes: Ref<Examen[]> = ref([])

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(EstadoSolicitudExamen, new EstadoSolicitudExamenController())
    const { entidad: estadoSolicitudExamen, listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados, guardar } = mixin.useComportamiento()
    const { onBeforeGuardar, onGuardado } = mixin.useHooks()

    cargarVista(async () => {
      const examenes = LocalStorage.getItem('examenes') ? JSON.parse(LocalStorage.getItem('examenes')!.toString()) : []

      await obtenerListados({
        laboratoriosClinicos: {
          controller: laboratorioClinicoController,
          params: { canton_id: empleado.canton, activo: 1, campos: 'id,nombre' },
        },
        cantones: [],
        examenes: examenes.length ? examenes : new ExamenController(),
      })
      listadosAuxiliares.cantones = JSON.parse(LocalStorage.getItem('cantones')!.toString())
      LocalStorage.set('examenes', JSON.stringify(listadosAuxiliares.examenes))
      cantones.value = listadosAuxiliares.cantones
    })

    /************
     * Funciones
     ************/
    const consultarLaboratoriosClinicos = async (canton: number) => {
      try {
        cargando.activar()
        const { result } = await laboratorioClinicoController.listar({ canton_id: canton, activo: 1, campos: 'id,nombre' })
        listadosAuxiliares.laboratoriosClinicos = result
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    const { cantones, filtrarCantones } = useFiltrosListadosSelects(listadosAuxiliares)

    /********
     * Hooks
     ********/
    onBeforeGuardar(() => {
      estadoSolicitudExamen.examenes_solicitados = estadoSolicitudExamen.examenes_solicitados.map((examen: ExamenSolicitado) => {
        return { ...examen, fecha_hora_asistencia: `${examen.fecha_asistencia} ${examen.hora_asistencia}` };
      })
    })

    onGuardado((id: number, responseData) => {
      const modelo = responseData.modelo
      emit('guardado', { id: modelo.id, page: 'SolicitudExamenPage' })
    })

    /************
     * Observers
     ************/
    let dd = 0
    /* watch(computed(() => estadoSolicitudExamen.examenes_solicitados), (examenes) => {
      examenes.map((examen: Examen, index: number) => {
        if (index === 0) {
          //
        }
      })
    }) */

    /*******
     * Init
     *******/
    // consultarTodosExamenes()
    estadoSolicitudExamen.registro_empleado_examen = medicoStore.idRegistroEmpleadoExamen
    console.log(medicoStore)

    examenesSolicitados?.forEach((examen: Examen) => {
      const examenSolicitado = new ExamenSolicitado()
      // console.log(examen)
      examenSolicitado.examen = examen.id
      estadoSolicitudExamen.examenes_solicitados.push(examenSolicitado)
    })

    return {
      mixin,
      estadoSolicitudExamen,
      empleado,
      examenes,
      listadosAuxiliares,
      maskFecha,
      cantones,
      filtrarCantones,
      // funciones
      consultarLaboratoriosClinicos,
      guardar,
    }
  }
})
