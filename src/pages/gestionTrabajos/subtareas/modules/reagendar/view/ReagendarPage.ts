// Dependencias
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { required, requiredIf } from 'shared/i18n-validators'
import { reactive, defineComponent, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { AxiosResponse } from 'axios'
import { endpoints } from 'config/api'

// Componentes
import DesignarResponsableTrabajo from 'gestionTrabajos/subtareas/modules/designarResponsableTrabajo/view/DesignarResponsableTrabajo.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { EmpleadoGrupo } from 'pages/gestionTrabajos/subtareas/domain/EmpleadoGrupo'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'
import { useNotificaciones } from 'shared/notificaciones'
import { useSubtareaStore } from 'stores/subtarea'
import { maskFecha } from 'config/utils'

export default defineComponent({
  components: {
    DesignarResponsableTrabajo
  },
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<Tarea | Subtarea>,
      required: true,
    },
  },
  emits: ['cerrar-modal', 'seleccionar', 'guardado'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const subtareaStore = useSubtareaStore()

    /********
     * Mixin
     ********/
    const { listado } = props.mixinModal.useReferencias()

    /************
     * Variables
     ************/
    const codigoSubtareaSeleccionada = subtareaStore.codigoSubtareaSeleccionada
    const motivoSuspendido = subtareaStore.motivoSuspendido
    const fechaHoraSuspendido = subtareaStore.fechaHoraSuspendido
    const subtarea = reactive(new Subtarea())
    const { notificarCorrecto, notificarAdvertencia } = useNotificaciones()

    onMounted(() => {
      subtarea.es_ventana = subtareaStore.subtareaEsVentana
      subtarea.fecha_inicio_trabajo = subtareaStore.fechaInicioTrabajo
      subtarea.hora_inicio_trabajo = subtareaStore.horaInicioTrabajo
      subtarea.hora_fin_trabajo = subtareaStore.horaFinTrabajo
      subtarea.tiene_subtareas = subtareaStore.tareaTieneSubtareas
    })

    /*************
    * Validaciones
    **************/
    const rules = {
      fecha_inicio_trabajo: { required },
      hora_inicio_trabajo: { required: requiredIf(() => subtarea.es_ventana) },
      hora_fin_trabajo: { required: requiredIf(() => subtarea.es_ventana) },
    }

    const v$ = useVuelidate(rules, subtarea)
    const statusEssentialLoading = new StatusEssentialLoading()
    const axios = AxiosHttpRepository.getInstance()

    /*************
     * Funciones
     *************/
    async function reagendar() {

      const data = {
        es_ventana: subtarea.es_ventana,
        fecha_inicio_trabajo: subtarea.fecha_inicio_trabajo,
        hora_inicio_trabajo: subtarea.hora_inicio_trabajo,
        hora_fin_trabajo: subtarea.hora_fin_trabajo,
        grupo: subtarea.designar_otro_responsable ? subtarea.grupo : null,
        empleado: subtarea.designar_otro_responsable ? subtarea.empleado : null,
        modo_asignacion_trabajo: subtarea.modo_asignacion_trabajo,
        empleados_designados: subtarea.empleados_designados.map((empleado: EmpleadoGrupo) => empleado.id),
      }

      try {
        /* statusEssentialLoading.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.actualizar_fechas_reagendar) + '/' + subtareaStore.idSubtareaSeleccionada
        const response: AxiosResponse = await axios.put(ruta, data)
        console.log(subtareaStore.posicionSubtareaSeleccionada)*/
        // actualizarElemento(subtareaStore.posicionSubtareaSeleccionada, response.data.modelo)
        // console.log(subtarea)
        /*if (!subtarea.designar_otro_responsable) {
          data.grupo
          data.empleado
        }*/

        // if (subtarea.tiene_subtareas)
        reagendarSubtarea(data)
        // else reagendarTarea(data)

        emit('cerrar-modal', false)
        // notificarCorrecto(response.data.mensaje)
      } catch (e) {
        notificarAdvertencia('No se pudo agendar la subtarea')
      } finally {
        statusEssentialLoading.desactivar()
      }
    }

    async function reagendarTarea(data) {
      statusEssentialLoading.activar()
      const ruta = axios.getEndpoint(endpoints.actualizar_fechas_reagendar_tarea) + '/' + subtareaStore.idSubtareaSeleccionada
      const response: AxiosResponse = await axios.put(ruta, data)
      console.log(subtareaStore.posicionSubtareaSeleccionada)
      actualizarElemento(subtareaStore.posicionSubtareaSeleccionada, response.data.modelo)
      notificarCorrecto(response.data.mensaje)
    }

    async function reagendarSubtarea(data) {
      statusEssentialLoading.activar()
      const ruta = axios.getEndpoint(endpoints.actualizar_fechas_reagendar) + '/' + subtareaStore.idSubtareaSeleccionada
      const response: AxiosResponse = await axios.put(ruta, data)
      console.log(subtareaStore.posicionSubtareaSeleccionada)
      actualizarElemento(subtareaStore.posicionSubtareaSeleccionada, response.data.modelo)
      notificarCorrecto(response.data.mensaje)
    }

    function actualizarElemento(posicion: number, entidad: Subtarea): void {
      console.log(entidad)
      listado.value.splice(posicion, 1, entidad)
      console.log(listado.value)
      // listado.value = [...listado.value]
    }

    function seleccionarGrupo(grupo_id) {
      // subtarea.modo_asignacion_trabajo = modosAsignacionTrabajo.por_grupo
      subtarea.grupo = grupo_id
      // subtarea.empleado = null
    }

    function seleccionarEmpleado(empleado_id) {
      // subtarea.modo_asignacion_trabajo = modosAsignacionTrabajo.por_empleado
      subtarea.empleado = empleado_id
      // subtarea.grupo = null
    }

    function seleccionarModoDesignacion(modo: string) {
      subtarea.modo_asignacion_trabajo = modo
      subtarea.empleado = null
      subtarea.grupo = null
    }

    function seleccionarResponsable(idResponsable: number) {
      subtarea.empleado = idResponsable
    }

    return {
      v$,
      subtarea,
      codigoSubtareaSeleccionada,
      motivoSuspendido,
      fechaHoraSuspendido,
      reagendar,
      maskFecha,
      seleccionarGrupo,
      seleccionarEmpleado,
      seleccionarResponsable,
      seleccionarModoDesignacion,
    }
  }
})

// obtenerPausas()
