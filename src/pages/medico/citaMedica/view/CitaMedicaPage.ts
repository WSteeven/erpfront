// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { configuracionColumnasCitaMedica } from '../domain/configuracionColumnasCitaMedica'
import { estadosCitaMedica, tabOptionsEstadosCitaMedica, selectAgendarCitaMedicaMedico, selectAgendarCitaMedicaPaciente, opcionesDestinoCitaMedica, selectTipoCitaMedica, selectTipoCambioCargo, tiposCitaMedica } from 'config/utils/medico'
import { Ref, computed, defineComponent, reactive, ref } from 'vue'
import { useAuthenticationStore } from 'stores/authentication'
import { CitaMedica } from '../domain/CitaMedica'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { acciones, accionesTabla, maskFecha } from 'config/utils'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import DetallePaciente from 'medico/gestionarPacientes/view/DetallePaciente.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
// import EstadosSubtareas from 'components/tables/view/EstadosSubtareas.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ComportamientoModalesCitaMedica } from '../domain/ComportamientoModalesCitaMedica'
import { CitaMedicaController } from '../infraestructure/CitaMedicaController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { useBotonesCitaMedica } from '../application/UseBotonesCitaMedica'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { CitaMedicaModales } from '../domain/CitaMedicaModales'
import { ConsultaMedica } from 'pages/medico/diagnosticoReceta/domain/ConsultaMedica'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export default defineComponent({
  components: {
    TabLayoutTabs: TabLayoutFilterTabs2,
    EssentialTableTabs,
    DetallePaciente,
    ModalesEntidad,
  },
  setup() {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()
    const citaMedicaController = new CitaMedicaController()

    /*********
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(CitaMedica, citaMedicaController)
    const { entidad: citaMedica, accion, disabled, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, listar, cargarVista, obtenerListados, consultar } = mixin.useComportamiento()
    const { onConsultado, onBeforeModificar, onGuardado, onReestablecer, onModificado, onBeforeGuardar } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos,departamento_id,responsable_departamento',
            estado: 1,
          }
        },
      })
    })

    /****************
     * Controladores
     ****************/
    const empleadoController = new EmpleadoController()

    // stock a proyecto 27
    // notificaciones

    /***********
     * Variable
     ***********/
    const tabCita = ref(estadosCitaMedica.PENDIENTE)
    const tabCitaAccidenteTrabajo = ref(estadosCitaMedica.PENDIENTE)
    const tabLayout = ref()
    const empleado = reactive(new Empleado())
    const cargando = new StatusEssentialLoading()
    const fecha_cita_medica = ref()
    const hora_cita_medica = ref()
    const fechaAccidente = ref()
    const horaAccidente = ref()
    const destinoCitaMedica = ref(opcionesDestinoCitaMedica.PARA_MI)
    const enfermedadesComunes: Ref<CitaMedica[]> = ref([])
    const accidentesTrabajo: Ref<CitaMedica[]> = ref([])

    const modales = new ComportamientoModalesCitaMedica()

    const configuracionColumnasCitaMedicaAccidenteTransito: ColumnConfig<CitaMedica>[] = [
      ...configuracionColumnasCitaMedica,
      {
        name: 'dado_alta',
        field: 'dado_alta',
        label: 'Dado alta',
      },
    ]

    /************
     * Funciones
     ************/
    const { empleados, filtrarEmpleados, ordenarEmpleados } = useFiltrosListadosSelects(listadosAuxiliares)
    const {
      btnCancelarCita: btnCancelarCitaEnfermedadComun,
      btnRechazar: btnRechazarEnfermedadComun,
      btnDiagnosticoReceta: btnDiagnosticoRecetaEnfermedadComun,
      btnAgendarCita: btnAgendarCitaEnfermedadComun
    } = useBotonesCitaMedica(enfermedadesComunes, accion, consultar, tabCita, modales)

    const {
      btnCancelarCita: btnCancelarCitaAccidenteTrabajo,
      btnRechazar: btnRechazarAccidenteTrabajo,
      btnDiagnosticoReceta: btnDiagnosticoRecetaAccidenteTrabajo,
      btnAgendarCita: btnAgendarCitaAccidenteTrabajo
    } = useBotonesCitaMedica(accidentesTrabajo, accion, consultar, tabCitaAccidenteTrabajo, modales)

    const filtrarCitaMedica = (tabSeleccionado: string) => {
      tabCita.value = tabSeleccionado
      const params = { estado_cita_medica: tabCita.value, paciente_id: authenticationStore.user.id }
      if (authenticationStore.esMedico) delete params.paciente_id
      listar(params)
    }

    const consultarEmpleado = async (id: number) => {
      try {
        cargando.activar()
        const campos = { campos: 'id,foto_url,nombres,apellidos,identificacion,nombre_canton,email,fecha_nacimiento,tipo_sangre,genero,telefono,area_info,nombre_cargo,fecha_ingreso,canton' }
        const { result } = await empleadoController.consultar(id, campos)
        empleado.hydrate(result)
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    const consultarCitasMedicasEnfermedadComun = async (tabSeleccionado?: string) => {
      console.log('consudbfsydjdsbdsdhbj')
      try {
        cargando.activar()
        const params = { estado_cita_medica: tabSeleccionado ?? estadosCitaMedica.PENDIENTE, paciente_id: authenticationStore.user.id, tipo_cita_medica: tiposCitaMedica.ENFERMEDAD_COMUN.value }
        if (authenticationStore.esMedico) delete params.paciente_id

        const { result } = await citaMedicaController.listar(params)
        enfermedadesComunes.value = result
        tabCita.value = tabSeleccionado ?? estadosCitaMedica.PENDIENTE
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    const consultarCitasMedicasAccidenteTrabajo = async (tabSeleccionado?: string) => {
      try {
        cargando.activar()
        const params = { estado_cita_medica: tabSeleccionado ?? estadosCitaMedica.PENDIENTE, paciente_id: authenticationStore.user.id, tipo_cita_medica: tiposCitaMedica.ACCIDENTE_DE_TRABAJO.value }
        if (authenticationStore.esMedico) delete params.paciente_id

        const { result } = await citaMedicaController.listar(params)
        accidentesTrabajo.value = result
        tabCitaAccidenteTrabajo.value = tabSeleccionado ?? estadosCitaMedica.PENDIENTE
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    const consultarCitaMedica = ({ entidad }) => {
      consultar(entidad)
      accion.value = acciones.consultar
    }

    const guardadoCitaMedica = (params: { page: keyof CitaMedicaModales, entidad: ConsultaMedica, hook }) => {
      // const consultaMedica: ConsultaMedica = params.entidad
      const citaMedica = new CitaMedica()
      citaMedica.hydrate(params.entidad)
      citaMedica.id = params.entidad.cita_medica

      const indexEC = enfermedadesComunes.value.findIndex((cita: CitaMedica) => cita.id === citaMedica.id)
      const indexAT = accidentesTrabajo.value.findIndex((cita: CitaMedica) => cita.id === citaMedica.id)

      switch (params.page) {
        case 'DiagnosticoRecetaPage':
          if (params.hook === 'onGuardado') {
            if (indexEC) enfermedadesComunes.value.splice(indexEC, 1)
            if (indexAT) accidentesTrabajo.value.splice(indexAT, 1)
          }

          if (params.hook === 'onModificado') {
            console.log('modificado')
            console.log(params.entidad)
            if (indexEC) enfermedadesComunes.value.splice(indexEC, 1, citaMedica)
            if (indexAT) accidentesTrabajo.value.splice(indexAT, 1, citaMedica)
          }

          break
      }
    }

    /*************
    * Validaciones
    **************/
    const reglas = {
      sintomas: { required },
      paciente: { required },
      tipo_cita_medica: { required },
    }

    const v$ = useVuelidate(reglas, citaMedica)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    onConsultado(async () => {
      const fecha_hora = citaMedica.fecha_hora_cita?.split(' ') ?? []
      const fechaHoraAccidente = citaMedica.fecha_hora_accidente?.split(' ') ?? []

      fecha_cita_medica.value = fecha_hora[0]
      hora_cita_medica.value = fecha_hora[1]

      fechaAccidente.value = fechaHoraAccidente[0]
      horaAccidente.value = fechaHoraAccidente[1]

      if (citaMedica.paciente_id) await consultarEmpleado(citaMedica.paciente_id)
    })

    onBeforeGuardar(() => {
      citaMedica.fecha_hora_accidente = fechaAccidente.value + ' ' + horaAccidente.value
    })

    onBeforeModificar(() => {
      citaMedica.fecha_hora_cita = fecha_cita_medica.value + ' ' + hora_cita_medica.value
      citaMedica.paciente = citaMedica.paciente_id
    })

    onGuardado((id, responseData) => {
      const modelo = responseData.modelo as CitaMedica
      
      if (tabCita.value === estadosCitaMedica.PENDIENTE) {
        if (modelo.tipo_cita_medica === tiposCitaMedica.ENFERMEDAD_COMUN.value) {
          enfermedadesComunes.value.push(modelo)
        }
      }

      if (tabCitaAccidenteTrabajo.value === estadosCitaMedica.PENDIENTE) {
        if (modelo.tipo_cita_medica === tiposCitaMedica.ACCIDENTE_DE_TRABAJO.value) {
          accidentesTrabajo.value.push(modelo)
        }
      }
    })

    onModificado((id, responseData) => {
      const modelo = responseData.modelo as CitaMedica

      if (tabCita.value === estadosCitaMedica.PENDIENTE) {
        if (modelo.tipo_cita_medica === tiposCitaMedica.ENFERMEDAD_COMUN.value && [estadosCitaMedica.RECHAZADO, estadosCitaMedica.CANCELADO, estadosCitaMedica.AGENDADO].includes(modelo.estado_cita_medica ?? '')) {
          const index = enfermedadesComunes.value.findIndex((cita: CitaMedica) => cita.id === modelo.id)
          enfermedadesComunes.value.splice(index, 1)
        }
      }

      if (tabCitaAccidenteTrabajo.value === estadosCitaMedica.PENDIENTE) {
        if (modelo.tipo_cita_medica === tiposCitaMedica.ACCIDENTE_DE_TRABAJO.value && [estadosCitaMedica.RECHAZADO, estadosCitaMedica.CANCELADO, estadosCitaMedica.AGENDADO].includes(modelo.estado_cita_medica ?? '')) {
          const index = accidentesTrabajo.value.findIndex((cita: CitaMedica) => cita.id === modelo.id)
          accidentesTrabajo.value.splice(index, 1)
        }
      }
    })

    onReestablecer(() => {
      hora_cita_medica.value = null
      fecha_cita_medica.value = null
      horaAccidente.value = null
      fechaAccidente.value = null
      citaMedica.estado_cita_medica = estadosCitaMedica.PENDIENTE
      empleados.value = listadosAuxiliares.empleados
      citaMedica.paciente = authenticationStore.user.id
      destinoCitaMedica.value = opcionesDestinoCitaMedica.PARA_MI
      empleado.hydrate(authenticationStore.user)
    })

    /*******
     * Init
     *******/
    citaMedica.estado_cita_medica = estadosCitaMedica.PENDIENTE
    citaMedica.paciente = authenticationStore.user.id
    empleado.hydrate(authenticationStore.user)

    const enfermedadComunTabPanel = {
      label: tiposCitaMedica.ENFERMEDAD_COMUN.label,
      accion: consultarCitasMedicasEnfermedadComun,
    }

    const accidenteTrabajoTabPanel = {
      label: tiposCitaMedica.ACCIDENTE_DE_TRABAJO.label,
      accion: consultarCitasMedicasAccidenteTrabajo,
    }

    const esPaciente = computed(() => citaMedica.paciente_id === authenticationStore.user?.id)

    return {
      v$,
      mixin,
      accion,
      disabled,
      acciones,
      modales,
      citaMedica,
      configuracionColumnasCitaMedica,
      tabCita,
      tabCitaAccidenteTrabajo,
      filtrarCitaMedica,
      tabOptionsEstadosCitaMedica,
      empleado,
      estadosCitaMedica,
      mostrarAgendado: computed(() => citaMedica.estado_cita_medica === estadosCitaMedica.AGENDADO),
      esMedico: computed(() => authenticationStore.esMedico), // && citaMedica.estado_cita_medica !== estadosCitaMedica.PENDIENTE),
      esPaciente,
      estaPendiente: computed(() => citaMedica.estado_cita_medica === estadosCitaMedica.PENDIENTE),
      estaCancelado: computed(() => citaMedica.estado_cita_medica === estadosCitaMedica.CANCELADO),
      estaRechazado: computed(() => citaMedica.estado_cita_medica === estadosCitaMedica.RECHAZADO),
      esAccidenteTrabajo: computed(() => citaMedica.tipo_cita_medica === tiposCitaMedica.ACCIDENTE_DE_TRABAJO.value),
      maskFecha,
      fecha_cita_medica,
      hora_cita_medica,
      fechaAccidente,
      horaAccidente,
      selectEstadoCita: computed(() => {
        if (authenticationStore.esMedico) {
          /* if (!esPaciente.value) {
            const index = selectAgendarCitaMedicaMedico.findIndex((estado) => estado.value === estadosCitaMedica.CANCELADO)
            selectAgendarCitaMedicaMedico.splice(index, 1)
          } */
          return selectAgendarCitaMedicaMedico
        } else {
          return selectAgendarCitaMedicaPaciente
        }
      }),
      opcionesDestinoCitaMedica,
      destinoCitaMedica,
      selectTipoCitaMedica,
      empleados,
      filtrarEmpleados,
      ordenarEmpleados,
      tiposCitaMedica,
      enfermedadesComunes,
      accidentesTrabajo,
      consultarCitasMedicasEnfermedadComun,
      consultarCitasMedicasAccidenteTrabajo,
      enfermedadComunTabPanel,
      accidenteTrabajoTabPanel,
      accionesTabla,
      consultarCitaMedica,
      tabLayout,
      guardadoCitaMedica,
      configuracionColumnasCitaMedicaAccidenteTransito,
      selectTipoCambioCargo,
      // Botones tabla
      btnCancelarCitaEnfermedadComun,
      btnRechazarEnfermedadComun,
      btnDiagnosticoRecetaEnfermedadComun,
      btnAgendarCitaEnfermedadComun,
      btnCancelarCitaAccidenteTrabajo,
      btnRechazarAccidenteTrabajo,
      btnDiagnosticoRecetaAccidenteTrabajo,
      btnAgendarCitaAccidenteTrabajo,
    }
  }
})
