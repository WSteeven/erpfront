// Dependencias
import { Ref, defineComponent, ref } from 'vue'
import { useMedicoStore } from 'stores/medico'
import { maskFecha } from 'config/utils'
import { LocalStorage } from 'quasar'

// Componentes
import FormularioSolicitudExamen from 'medico/solicitudesExamenes/view/FormularioSolicitudExamen.vue'
import SimpleLayout from 'shared/contenedor/modules/simple/view/SimpleLayout.vue'

// Logica y controladores
import { LaboratorioClinicoController } from 'medico/laboratoriosMedicos/infraestructure/LaboratorioClinicoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { ExamenController } from 'pages/medico/examenes/infraestructure/ExamenController'
import { SolicitudExamen } from 'pages/medico/solicitudesExamenes/domain/SolicitudExamen'
import { SolicitudExamenController } from 'pages/medico/solicitudesExamenes/infraestructure/SolicitudExamenController'
import { ExamenSolicitado } from 'pages/medico/solicitudesExamenes/domain/ExamenSolicitado'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Examen } from 'pages/medico/examenes/domain/Examen'

export default defineComponent({
  components: {
    FormularioSolicitudExamen,
    SimpleLayout,
  },
  emits: ['guardado', 'cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const medicoStore = useMedicoStore()
    const empleado = medicoStore.empleado
    const canton = ref(empleado.canton)

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
    const mixin = new ContenedorSimpleMixin(SolicitudExamen, new SolicitudExamenController())
    const { entidad: solicitudExamen, listadosAuxiliares, accion, disabled } = mixin.useReferencias()
    const { cargarVista, obtenerListados, guardar } = mixin.useComportamiento()
    const { onBeforeGuardar, onGuardado } = mixin.useHooks()

    /* cargarVista(async () => {
      const examenes = LocalStorage.getItem('examenes') ? JSON.parse(LocalStorage.getItem('examenes')!.toString()) : []

      await obtenerListados({
        laboratoriosClinicos: {
          controller: laboratorioClinicoController,
          params: { canton_id: canton.value, activo: 1, campos: 'id,nombre' },
        },
        cantones: [],
        examenes: examenes.length ? examenes : new ExamenController(),
      })

      listadosAuxiliares.cantones = JSON.parse(LocalStorage.getItem('cantones')!.toString())
      LocalStorage.set('examenes', JSON.stringify(listadosAuxiliares.examenes))
      cantones.value = listadosAuxiliares.cantones
    }) */

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
        solicitudExamen.examenes_solicitados = solicitudExamen.examenes_solicitados.map((examen: ExamenSolicitado) => {
          examen.laboratorio_clinico = laboratorioClinico
          return examen
        })
      }
    }

    const asignarFecha = (fecha: string, index: number) => {
      if (index === 0) {
        solicitudExamen.examenes_solicitados = solicitudExamen.examenes_solicitados.map((examen: ExamenSolicitado) => {
          examen.fecha_asistencia = fecha
          return examen
        })
      }
    }

    const asignarHora = (hora: string, index: number) => {
      if (index === 0) {
        solicitudExamen.examenes_solicitados = solicitudExamen.examenes_solicitados.map((examen: ExamenSolicitado) => {
          examen.hora_asistencia = hora
          return examen
        })
      }
    }

    /********
     * Hooks
     ********/
    /*onBeforeGuardar(() => {
      solicitudExamen.examenes_solicitados = solicitudExamen.examenes_solicitados.map((examenSolicitado: ExamenSolicitado) => {
        // const examenSolicitadoAux = new ExamenSolicitado()
        // examenSolicitadoAux.hydrate(examenSolicitado)
        examenSolicitado.fecha_hora_asistencia = `${examenSolicitado.fecha_asistencia} ${examenSolicitado.hora_asistencia}`
        return examenSolicitado //Aux
      })
      solicitudExamen.canton = canton.value

      idExamenesSolicitados = solicitudExamen.examenes_solicitados.map((ex: ExamenSolicitado) => ex.examen as number)
    })*/

    onGuardado((id: number, responseData) => {
      const idExamenesSolicitados = responseData.modelo.examenes_solicitados.map((ex: ExamenSolicitado) => ex.examen as number)
      emit('guardado', { data: { idExamenesSolicitados }, page: 'SolicitudExamenSolicitarPage' })
      emit('cerrar-modal')
    })

    /*******
     * Init
     *******/
    solicitudExamen.hydrate(medicoStore.solicitudExamen)
    solicitudExamen.registro_empleado_examen = medicoStore.idRegistroEmpleadoExamen
    accion.value = medicoStore.accion

    return {
      mixin,
      solicitudExamen,
      empleado,
      examenes,
      listadosAuxiliares,
      maskFecha,
      canton,
      cantones,
      filtrarCantones,
      accion,
      disabled,
      // funciones
      consultarLaboratoriosClinicos,
      guardar,
      asignarLaboratorio,
      asignarFecha,
      asignarHora,
    }
  }
})
