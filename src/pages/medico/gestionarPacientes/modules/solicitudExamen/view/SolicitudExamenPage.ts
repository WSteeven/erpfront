// Dependencias
import { Ref, defineComponent, ref } from 'vue'
import { useMedicoStore } from 'stores/medico'

// Componentes
import DetallePaciente from '../../../view/DetallePaciente.vue'

// Logica y controladores
import { LaboratorioClinicoController } from 'medico/laboratoriosMedicos/infraestructure/LaboratorioClinicoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EstadoSolicitudExamenController } from '../infraestructure/EstadoSolicitudExamenController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { ExamenController } from 'pages/medico/examenes/infraestructure/ExamenController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { EstadoSolicitudExamen } from '../domain/EstadoSolicitudExamen'
import { ExamenSolicitado } from '../domain/ExamenSolicitado'
import { Examen } from 'pages/medico/examenes/domain/Examen'
import { maskFecha } from 'config/utils'
import { LocalStorage } from 'quasar'

export default defineComponent({
  components: {
    DetallePaciente,
  },
  emits: ['guardado', 'cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const medicoStore = useMedicoStore()
    const empleado = medicoStore.empleado
    const examenesSolicitados = medicoStore.examenesSolicitados

    /************
     * Variables
     ************/
    const cargando = new StatusEssentialLoading()
    const laboratorioClinicoController = new LaboratorioClinicoController()
    const examenes: Ref<Examen[]> = ref([])
    let idExamenesSolicitados: number[]

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
    const { cantones, filtrarCantones } = useFiltrosListadosSelects(listadosAuxiliares)

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


    const asignarLaboratorio = (laboratorioClinico: number, index: number) => {
      if (index === 0) {
        estadoSolicitudExamen.examenes_solicitados = estadoSolicitudExamen.examenes_solicitados.map((examen: ExamenSolicitado) => {
          examen.laboratorio_clinico = laboratorioClinico
          return examen
        })
      }
    }

    const asignarFecha = (fecha: string, index: number) => {
      if (index === 0) {
        estadoSolicitudExamen.examenes_solicitados = estadoSolicitudExamen.examenes_solicitados.map((examen: ExamenSolicitado) => {
          examen.fecha_asistencia = fecha
          return examen
        })
      }
    }

    const asignarHora = (hora: string, index: number) => {
      if (index === 0) {
        estadoSolicitudExamen.examenes_solicitados = estadoSolicitudExamen.examenes_solicitados.map((examen: ExamenSolicitado) => {
          examen.hora_asistencia = hora
          return examen
        })
      }
    }

    /********
     * Hooks
     ********/
    onBeforeGuardar(() => {
      estadoSolicitudExamen.examenes_solicitados = estadoSolicitudExamen.examenes_solicitados.map((examen: ExamenSolicitado) => {
        return { ...examen, fecha_hora_asistencia: `${examen.fecha_asistencia} ${examen.hora_asistencia}` }
      })
      idExamenesSolicitados = estadoSolicitudExamen.examenes_solicitados.map((examen: ExamenSolicitado) => examen.id)
    })

    onGuardado((id: number, responseData) => {
      const modelo = responseData.modelo
      emit('guardado', { data: { idExamenesSolicitados }, page: 'SolicitudExamenPage' })
      emit('cerrar-modal')
    })

    /*******
     * Init
     *******/
    estadoSolicitudExamen.registro_empleado_examen = medicoStore.idRegistroEmpleadoExamen

    examenesSolicitados?.forEach((examen: Examen) => {
      const examenSolicitado = new ExamenSolicitado()
      examenSolicitado.hydrate(examen)
      // examenSolicitado.examen = examen.id
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
      asignarLaboratorio,
      asignarFecha,
      asignarHora,
    }
  }
})
