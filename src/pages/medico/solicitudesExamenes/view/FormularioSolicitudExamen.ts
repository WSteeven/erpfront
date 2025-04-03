// Dependencias
import { Ref, computed, defineComponent, ref } from 'vue'
import { acciones, maskFecha, rolesSistema } from 'config/utils'
import { LocalStorage } from 'quasar'

// Componentes
import SimpleLayout from 'shared/contenedor/modules/simple/view/SimpleLayout.vue'
import DetallePaciente from 'medico/gestionarPacientes/view/DetallePaciente.vue'

// Logica y controladores
import { LaboratorioClinicoController } from 'medico/laboratoriosMedicos/infraestructure/LaboratorioClinicoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { ExamenSolicitado } from 'pages/medico/solicitudesExamenes/domain/ExamenSolicitado'
import { ExamenController } from 'pages/medico/examenes/infraestructure/ExamenController'
import { SolicitudExamen } from 'pages/medico/solicitudesExamenes/domain/SolicitudExamen'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { Examen } from 'pages/medico/examenes/domain/Examen'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { EmpleadoRoleController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoRolesController'
import { EmpleadoPermisoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoPermisosController'
import { useAuthenticationStore } from 'stores/authentication'
import { estadosSolicitudesExamenes, selectAprobarEstadosSolicitudesExamenes } from 'config/utils/medico'

export default defineComponent({
  components: {
    DetallePaciente,
    SimpleLayout,
  },
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<SolicitudExamen>,
      required: true,
    },
    empleado: {
      type: Object as () => Empleado,
      required: true,
    },
  },
  emits: ['guardado', 'cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()

    /************
     * Variables
    ************/
    const empleado = props.empleado
    const cargando = new StatusEssentialLoading()
    const laboratorioClinicoController = new LaboratorioClinicoController()
    const examenes: Ref<Examen[]> = ref([])
    const mostrarCambiarCanton = ref(false)
    // let idExamenesSolicitados: number[]

    /********
     * Mixin
     ********/
    const { entidad: solicitudExamen, listadosAuxiliares, accion, disabled } = props.mixin.useReferencias()
    const { cargarVista, obtenerListados, guardar } = props.mixin.useComportamiento()
    const { onBeforeGuardar, onBeforeModificar } = props.mixin.useHooks()

    cargarVista(async () => {
      const examenes = LocalStorage.getItem('examenes') ? JSON.parse(LocalStorage.getItem('examenes')!.toString()) : []
      // const examenes = JSON.parse(LocalStorage.getItem('examenes')!.toString())

      await obtenerListados({
        laboratoriosClinicos: {
          controller: laboratorioClinicoController,
          params: { canton_id: empleado.canton, activo: 1, campos: 'id,nombre' },
        },
        autorizadores: {
          controller: new EmpleadoPermisoController(),
          params: {
            permisos: ['puede.autorizar.solicitudes_examenes'],
          },
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
      cargando.activar()
      try {
        limpiarLaboratorios()
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
      if (index === 0 && accion.value === acciones.nuevo) {
        solicitudExamen.examenes_solicitados = solicitudExamen.examenes_solicitados.map((examen: ExamenSolicitado) => {
          examen.fecha_asistencia = fecha
          return examen
        })
      }
    }

    const asignarHora = (hora: string, index: number) => {
      if (index === 0 && accion.value === acciones.nuevo) {
        solicitudExamen.examenes_solicitados = solicitudExamen.examenes_solicitados.map((examen: ExamenSolicitado) => {
          examen.hora_asistencia = hora
          return examen
        })
      }
    }

    const limpiarLaboratorios = () => {
      solicitudExamen.examenes_solicitados = solicitudExamen.examenes_solicitados.map((examen: ExamenSolicitado) => {
        examen.laboratorio_clinico = null
        return examen
      })
    }

    /********
     * Hooks
     ********/
    onBeforeGuardar(() => {
      console.log('on before guardar...')
      solicitudExamen.examenes_solicitados = solicitudExamen.examenes_solicitados.map((examenSolicitado: ExamenSolicitado) => {
        examenSolicitado.fecha_hora_asistencia = `${examenSolicitado.fecha_asistencia} ${examenSolicitado.hora_asistencia}`
        return examenSolicitado
      })

      solicitudExamen.canton = empleado.canton
    })

    onBeforeModificar(() => {
      console.log('on before modificar...')
      solicitudExamen.examenes_solicitados = solicitudExamen.examenes_solicitados.map((examenSolicitado: ExamenSolicitado) => {
        examenSolicitado.fecha_hora_asistencia = `${examenSolicitado.fecha_asistencia} ${examenSolicitado.hora_asistencia}`
        return examenSolicitado
      })

      solicitudExamen.canton = empleado.canton
    })

    return {
      mixin: props.mixin,
      solicitudExamen,
      empleado,
      examenes,
      listadosAuxiliares,
      maskFecha,
      esAutorizador: computed(() => solicitudExamen.autorizador === authenticationStore.user.id), // accion.value === acciones.editar
      selectAprobarEstadosSolicitudesExamenes,
      mostrarCambiarCanton,
      acciones,
      estadosSolicitudesExamenes,
      // canton,iiiiiii
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
