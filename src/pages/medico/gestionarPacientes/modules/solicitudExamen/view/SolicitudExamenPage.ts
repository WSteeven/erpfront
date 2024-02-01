// Dependencias
import { useMedicoStore } from 'stores/medico'
import { Ref, computed, defineComponent, ref } from 'vue'

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
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'

export default defineComponent({
  components: {
    DetallePaciente,
  },
  setup() {
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
    const { cargarVista, obtenerListados } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        laboratoriosClinicos: {
          controller: laboratorioClinicoController,
          params: { canton_id: empleado.canton },
        },
        cantones: new CantonController(),
        examenes: new ExamenController(),
      })
    })

    /************
     * Funciones
     ************/
    const consultarLaboratoriosClinicos = async (canton: number) => {
      try {
        cargando.activar()
        const { result } = await laboratorioClinicoController.listar({ canton_id: canton })
        listadosAuxiliares.laboratoriosClinicos = result
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    const guardar = async () => {
      //
    }

    const cancelar = () => {
      //
    }

    /*******
     * Init
     *******/
    // consultarTodosExamenes()

    examenesSolicitados?.forEach((examen: Examen) => {
      const examenSolicitado = new ExamenSolicitado()
      // console.log(examen)
      examenSolicitado.examen_id = examen.id
      estadoSolicitudExamen.examenes_solicitados.push(examenSolicitado)
    })

    return {
      mixin,
      estadoSolicitudExamen,
      empleado,
      examenes,
      listadosAuxiliares,
      // funciones
      consultarLaboratoriosClinicos,
    }
  }
})
