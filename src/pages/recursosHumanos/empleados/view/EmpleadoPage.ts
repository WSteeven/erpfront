//Dependencias
import { configuracionColumnasTipoDiscapacidadPorcentaje } from '../domain/configuracionColumnasTipoDiscapacidadPorcentaje'
import { configuracionColumnasEmpleados } from '../domain/configuracionColumnasEmpleados'
import {
  maxLength,
  minLength,
  numeric,
  required,
  requiredIf
} from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import {
  acciones,
  accionesTabla,
  convertir_fecha,
  maskFecha,
  niveles_academicos,
  rolesSistema,
  talla_letras,
  tipos_sangre
} from 'config/utils'
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  Ref,
  ref,
  watchEffect
} from 'vue'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import InformacionLicencia from 'vehiculos/conductores/view/InformacionLicencia.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RolController } from 'pages/administracion/roles/infraestructure/RolController'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { EmpleadoController } from '../infraestructure/EmpleadoController'
import { useNotificacionStore } from 'stores/notificacion'
import { Empleado } from '../domain/Empleado'
import { LocalStorage, useQuasar } from 'quasar'
import { CargoController } from 'pages/recursosHumanos/cargos/infraestructure/CargoController'
import { TipoContratoController } from 'pages/recursosHumanos/tipo-contrato/infraestructure/TipoContratoController'
import { DepartamentoController } from 'pages/recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { EstadoCivilController } from 'pages/recursosHumanos/estado-civil/infraestructure/EstadoCivilController'
import { AreasController } from 'pages/recursosHumanos/areas/infraestructure/AreasController'
import { BancoController } from 'pages/recursosHumanos/banco/infrestruture/BancoController'
import { configuracionColumnasFamiliaresEmpleado } from 'pages/recursosHumanos/familiares/domain/configuracionColumnasFamiliaresEmpleado'
import { ComportamientoModalesEmpleado } from '../application/ComportamientoModalesEmpleado'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { Familiares } from 'pages/recursosHumanos/familiares/domain/Familiares'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import {
  encontrarUltimoIdListado,
  imprimirArchivo,
  ordenarLista
} from 'shared/utils'
import { useCargandoStore } from 'stores/cargando'
import { AxiosResponse } from 'axios'
import { useNotificaciones } from 'shared/notificaciones'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { Conductor } from 'vehiculos/conductores/domain/Conductor'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { ValidarChofer } from '../application/ValidarChofer'
import { TipoDiscapacidadController } from 'pages/recursosHumanos/tipo-discapacidad/infraestructure/TipoDiscapacidadController'
import { TipoDiscapacidadPorcentaje } from '../domain/TipoDiscapacidadPorcentaje'
import { TipoDiscapacidad } from 'pages/recursosHumanos/tipo-discapacidad/domain/TipoDiscapacidad'
import {
  autoidentificaciones_etnicas,
  parentezcos
} from 'config/recursosHumanos.utils'
import { usePostulanteStore } from 'stores/recursosHumanos/seleccionContratacion/postulante'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { tabOptionsProveedoresInternacionales } from 'config/utils_compras_proveedores'
import { useEmpleadoStore } from 'stores/empleado'

export default defineComponent({
  components: {
    TabLayoutFilterTabs2,
    SelectorImagen,
    ModalesEntidad,
    EssentialTable,
    GestorArchivos,
    InformacionLicencia
  },
  setup() {
    /*********
     * Stores
     *********/
    const postulanteStore = usePostulanteStore()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const { notificarCorrecto, confirmar } = useNotificaciones()
    const cargando = new StatusEssentialLoading()

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      Empleado,
      new EmpleadoController(),
      new ArchivoController()
    )
    const {
      entidad: empleado,
      disabled,
      accion,
      listadosAuxiliares,
      listado
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } =
      mixin.useComportamiento()
    const {
      onBeforeGuardar,
      onBeforeModificar,
      onConsultado,
      onGuardado,
      onReestablecer
    } = mixin.useHooks()

    const conductor = reactive(new Conductor())
    /********************************
     * LISTADOS Y FILTROS
     ********************************/
    const {
      empleados,
      filtrarEmpleados,
      cantones,
      filtrarCantones,
      cargos,
      filtrarCargos,
      roles,
      filtrarRoles,
      tiposContratos,
      estadosCiviles,
      bancos,
      filtrarBancos,
      areas,
      filtrarAreas,
      grupos,
      filtrarGrupos,
      departamentos,
      filtrarDepartamentos
    } = useFiltrosListadosSelects(listadosAuxiliares)

    /************
     * Variables
     ************/
    const tabDefecto = ref('1')
    const configuracionColumnasTipoDiscapacidadPorcentajeReactive = reactive(
      configuracionColumnasTipoDiscapacidadPorcentaje
    )
    const estado_civiles = ref([])
    const tipos_contrato = ref([])
    const tiposDiscapacidades = ref([])
    const opcionesDepartamentos = ref([])
    const orientaciones_sexuales = ref([])
    const identidades_genero = ref([])
    const religiones = ref([])
    const refFamiliares = ref()
    const modales = new ComportamientoModalesEmpleado()
    const empleadoStore = useEmpleadoStore()
    const store = useAuthenticationStore()
    const nombre_usuario = ref()
    const email_usuario = ref()
    const refApellidos = ref()

    // const mostrarBotonSubirArchivos = ref(false) //computed(()=>{
    const mostrarComponenteInformacionLicencia = ref(false)
    const refArchivo = ref()
    const mostrarBotonSubirArchivos = computed(() =>
      refArchivo.value != undefined
        ? refArchivo.value.quiero_subir_archivos
        : false
    )
    const idEmpleado = ref()
    const componenteCargado = ref(false)
    const idsTiposDiscapacidades: Ref<number[]> = ref([])
    const idsParentescos: Ref<number[]> = ref([])
    const construccionConfiguracionColumnas = ref(false)
    cargarVista(async () => {
      if (postulanteStore.idUser) await cargarDatosPostulante()
      await obtenerListados({
        areas: new AreasController(),
        bancos: new BancoController(),
        cargos: {
          controller: new CargoController(),
          params: { estado: 1 }
        },
        departamentos: {
          controller: new DepartamentoController(),
          params: { activo: 1 }
        },
        tiposDiscapacidades: {
          controller: new TipoDiscapacidadController(),
          params: { campos: 'id,nombres' }
        },

        empleados: {
          controller: new EmpleadoController(),
          params: {
            // campos: 'id,nombres,apellidos',
            estado: 1
          }
        },
        estados_civiles: new EstadoCivilController(),
        grupos: {
          controller: new GrupoController(),
          params: { activo: 1 }
        },
        tipos_contratos: new TipoContratoController(),
        roles: {
          controller: new RolController(),
          params: { campos: 'id,name' }
        }
        // orientaciones_sexuales: new OrientacionSexualController(),
        // identidades_genero: new IdentidadGeneroController(),
        // religiones: new ReligionController(),
      })
    }).then(() => {
      listadosAuxiliares.cantones = JSON.parse(
        LocalStorage.getItem('cantones')!.toString()
      )
      areas.value = listadosAuxiliares.areas
      bancos.value = listadosAuxiliares.bancos
      cantones.value = listadosAuxiliares.cantones
      cargos.value = listadosAuxiliares.cargos
      departamentos.value = listadosAuxiliares.departamentos
      empleados.value = listadosAuxiliares.empleados
      listado.value = listadosAuxiliares.empleados
      estadosCiviles.value = listadosAuxiliares.estados_civiles
      grupos.value = listadosAuxiliares.grupos
      roles.value = listadosAuxiliares.roles
      tiposContratos.value = listadosAuxiliares.tipos_contratos
      configuracionColumnasTipoDiscapacidadPorcentajeReactive.find(
        item => item.field === 'tipo_discapacidad'
      )!.options = listadosAuxiliares.tiposDiscapacidades.map(
        (v: TipoDiscapacidad) => {
          return { label: v.nombre, value: v.id }
        }
      )
      // console.log(configuracionColumnasTipoDiscapacidadPorcentaje);

      configuracionColumnasTipoDiscapacidadPorcentajeReactive.find(
        item => item.field === 'tipo_discapacidad'
      )!.options = listadosAuxiliares.tiposDiscapacidades.map(
        (v: TipoDiscapacidad) => {
          return { label: v.nombre, value: v.id }
        }
      )
      configuracionColumnasFamiliaresEmpleado.find(
        item => item.field === 'parentezco'
      )!.options = parentezcos.map((v: any) => {
        return { label: v.nombre, value: v.value }
      })
      construccionConfiguracionColumnas.value = true
    })

    const habilitarBotonAgregarFamiliares = computed(
      () => accion.value == acciones.nuevo || accion.value == acciones.editar
    )

    /****************************
     * Validaciones
     ****************************/
    const reglas = {
      identificacion: {
        required,
        minlength: minLength(8),
        maxlength: maxLength(10)
      },
      telefono: {
        required,
        numeric,
        minlength: minLength(9),
        maxlength: maxLength(14)
      },
      direccion: { required },
      tipo_sangre: { required },
      estado_civil: { required },
      area: { required },
      tipo_contrato: { required },
      banco: { required },
      num_cuenta: { required, maxLength: maxLength(12) },
      nivel_academico: { required },
      titulo: { required },
      salario: { required },
      fecha_ingreso: { required },
      nombres: { required },
      apellidos: { required },
      jefe: { required },
      email: { required },
      coordenadas: {
        required: requiredIf(() => accion.value === acciones.editar)
      },
      correo_personal: { required },
      usuario: { required },
      fecha_nacimiento: { required },
      cargo: { required },
      departamento: { required },
      roles: { required },
      estado: { required },
      grupo: { required: requiredIf(() => empleado.tiene_grupo) },
      talla_zapato: { required: requiredIf(() => empleado.tiene_grupo) },
      talla_camisa: { required },
      talla_pantalon: { required: requiredIf(() => empleado.tiene_grupo) },
      talla_guantes: { required: requiredIf(() => empleado.tiene_grupo) }
    }

    const v$ = useVuelidate(reglas, empleado)
    setValidador(v$.value)

    const validarConductor = new ValidarChofer(empleado, conductor)
    mixin.agregarValidaciones(validarConductor)

    const configuracionStore = useConfiguracionGeneralStore()
    tipos_contrato.value = listadosAuxiliares.tipos_contrato
    opcionesDepartamentos.value = listadosAuxiliares.departamentos
    estado_civiles.value = listadosAuxiliares.estado_civiles
    orientaciones_sexuales.value = listadosAuxiliares.orientaciones_sexuales
    identidades_genero.value = listadosAuxiliares.identidades_genero
    religiones.value = listadosAuxiliares.religiones
    areas.value = listadosAuxiliares.areas
    bancos.value = listadosAuxiliares.bancos
    /********
     * Hooks
     ********/

    // async function guardado(data) {
    //   empleado.familiares!.push(data.model)
    // }
    onBeforeGuardar(() => {
      if (empleado.roles.includes(rolesSistema.chofer)) {
        empleado.conductor = conductor
      } else {
        empleado.conductor = []
      }
      onReestablecer(() => {
        empleado.familiares = []
      })
    })
    onBeforeModificar(() => {
      if (empleado.roles.includes(rolesSistema.chofer)) {
        empleado.conductor = conductor
      } else {
        empleado.conductor = []
      }
    })
    // onModificado(() => console.log('modificado'))
    onReestablecer(() => {
      refArchivo.value.limpiarListado()
      verificarRolesSeleccionados()
    })
    onConsultado(() => {
      idEmpleado.value = empleado.id
      empleado.tiene_grupo = !!empleado.grupo
      nombre_usuario.value = empleado.usuario
      email_usuario.value = empleado.email

      if (empleado.roles.includes(rolesSistema.chofer)) {
        mostrarComponenteInformacionLicencia.value = true
        conductor.hydrate(
          empleado.conductor ? empleado.conductor : new Conductor()
        )
      } else {
        mostrarComponenteInformacionLicencia.value = false
      }

      // listar archivos
      setTimeout(() => {
        refArchivo.value.listarArchivosAlmacenados(empleado.id)
      }, 1)

      //verificar si se debe mostrar el campo de informacion de licencia del empleado
      verificarRolesSeleccionados()
    })
    // onMounted(() => console.log(refArchivo.value))

    onGuardado((id: number) => {
      idEmpleado.value = id
      setTimeout(() => {
        subirArchivos()
      }, 1)
    })

    function optionsFecha(date) {
      const hoy = convertir_fecha(new Date())
      return date <= hoy
    }

    async function subirArchivos() {
      await refArchivo.value.subir()
    }

    /************
     * Observers
     ************/
    watchEffect(() => {
      if (!empleado.tiene_grupo) empleado.grupo = null
      if (
        empleado.nombres != null &&
        empleado.nombres != '' &&
        accion.value == acciones.nuevo
      ) {
        const inicial_nombre =
          empleado.nombres != null ? empleado.nombres[0] : ''
        const apellido =
          empleado.apellidos != null ? empleado.apellidos.split(' ')[0] : ''
        const sitio_web =
          configuracionStore.configuracion?.sitio_web?.split('WWW.')[1]
        const username = inicial_nombre + apellido
        empleado.email = username + '@' + sitio_web
        empleado.usuario = username

        empleado.password = empleado.identificacion
      }
    })
    const btnEliminarFamiliar: CustomActionTable = {
      titulo: 'Eliminar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => store.can('puede.eliminar.familiares'),
      accion: ({ posicion }) =>
        confirmar('¿Está seguro de continuar?', () =>
          empleado.familiares?.splice(posicion, 1)
        )
    }
    const btnImprimirEmpleados: CustomActionTable = {
      titulo: 'Reporte General',
      icono: 'bi-printer',
      color: 'primary',
      visible: () => store.can('puede.ver.empleados'),
      accion: () => {
        generar_reporte_general()
      }
    }
    async function generar_reporte_general(): Promise<void> {
      // console.log('generar_reporte_general')
      const axios = AxiosHttpRepository.getInstance()
      const filename = 'empleados'
      const url_pdf =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.imprimir_reporte_general_empleado)
      await imprimirArchivo(url_pdf, 'GET', 'blob', 'pdf', filename, null)
    }

    const btnHabilitarEmpleado: CustomActionTable = {
      titulo: '',
      icono: 'bi-toggle2-on',
      color: 'negative',
      tooltip: 'Habilitar',
      visible: ({ entidad }) =>
        !entidad.estado && store.can('puede.activar.empleados'),
      accion: ({ entidad, posicion }) => {
        HabilitarEmpleado(entidad.id, true)
        listado.value.splice(posicion, 1)
      }
    }
    const btnDesHabilitarEmpleado: CustomActionTable = {
      titulo: '',
      icono: 'bi-toggle2-off',
      color: 'positive',
      tooltip: 'DesHabilitar',
      visible: ({ entidad }) =>
        entidad.estado && store.can('puede.desactivar.empleados'),
      accion: ({ entidad, posicion }) => {
        HabilitarEmpleado(entidad.id, false)
        entidad.estado = false
        listado.value.splice(posicion, 1)
      }
    }

    const agregarDiscapacidad = () => {
      const fila = new TipoDiscapacidadPorcentaje()
      fila.id = empleado.discapacidades?.length
        ? encontrarUltimoIdListado(empleado.discapacidades) + 1
        : 1
      empleado.discapacidades?.push(fila)
    }

    const agregarFamiliares = () => {
      const fila = new Familiares()
      fila.id = empleado.familiares?.length
        ? encontrarUltimoIdListado(empleado.familiares) + 1
        : 1
      empleado.familiares?.push(fila)
    }

    function reestablecer_usuario() {
      if (accion.value == acciones.editar && empleado.generar_usuario) {
        generarUsename()
      } else {
        empleado.usuario = nombre_usuario.value
        empleado.email = email_usuario.value
      }
    }

    const btnEliminarDiscapacidad: CustomActionTable<TipoDiscapacidadPorcentaje> =
      {
        titulo: 'Eliminar',
        icono: 'bi-x',
        color: 'negative',
        accion: ({ posicion }) =>
          confirmar('¿Está seguro de continuar?', () =>
            empleado.discapacidades?.splice(posicion, 1)
          )
      }

    const btnPlanVacaciones: CustomActionTable = {
      titulo: 'Plan Vacaciones',
      icono: 'bi-sunglasses',
      color: 'accent',
      accion: ({ entidad }) => {
        empleadoStore.idEmpleado = entidad.id
        console.log('entidad', entidad)
        modales.abrirModalEntidad('PlanVacacionPage')
        console.log('paso el abrir modal', modales)
      },
      visible: true
    }

    function obtenerUsername() {
      if (accion.value == acciones.editar && empleado.generar_usuario) {
        generarUsename()
      }
      if (
        accion.value == acciones.nuevo &&
        empleado.nombres != null &&
        empleado.nombres != '' &&
        empleado.apellidos != null &&
        empleado.apellidos != ''
      ) {
        generarUsename()
      }
    }
    async function generarUsename() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.generar_username, {
        nombres: empleado.nombres,
        apellidos: empleado.apellidos,
        usuario: empleado.usuario
      })
      const response: AxiosResponse = await axios.get(ruta)
      const username = ref(response.data.username)
      const sitio_web =
        configuracionStore.configuracion?.sitio_web?.split('WWW.')[1]
      empleado.usuario = username.value
      empleado.email = username.value + '@' + sitio_web
    }
    async function HabilitarEmpleado(id: number, estado: boolean) {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.habilitar_empleado, {
        id: id,
        estado: estado
      })
      await axios.get(ruta)
      notificarCorrecto(
        estado ? 'Ha Habilitado empleado' : 'Ha deshabilitado empleado'
      )
    }

    async function filtrarListadoEmpleados(tab: string) {
      tabDefecto.value = tab
      if (listado.value.length > 0) await listar({ estado: tab })
    }

    function verificarRolesSeleccionados() {
      if (empleado.roles.includes(rolesSistema.chofer)) {
        mostrarComponenteInformacionLicencia.value = true
      } else {
        mostrarComponenteInformacionLicencia.value = false
        conductor.hydrate(new Conductor())
      }
    }
    async function cargarDatosPostulante() {
      //Aqui hay que hacer la carga de los datos del nuevo empleado
      const postulante = await obtenerUsuarioExterno()

      //rellenamos los datos comunes
      empleado.apellidos = postulante.apellidos
      empleado.correo_personal = postulante.correo_personal
      empleado.direccion = postulante.direccion
      empleado.fecha_nacimiento = postulante.fecha_nacimiento
      empleado.genero = postulante.genero
      empleado.identidad_genero = postulante.identidad_genero
      empleado.nombres = postulante.nombres
      empleado.identificacion = postulante.numero_documento_identificacion
      empleado.telefono = postulante.telefono
      refApellidos.value.focus()
    }

    async function obtenerUsuarioExterno() {
      cargando.activar()
      const axios = AxiosHttpRepository.getInstance()
      const ruta =
        axios.getEndpoint(endpoints.usuarios_externos) +
        '/' +
        postulanteStore.idUser
      const response: AxiosResponse = await axios.get(ruta)
      cargando.desactivar()
      return response.data.modelo
    }

    /**
     * HOOKS
     */
    onMounted(() => {
      // console.log('EmpleadoPage -> Montado')
      componenteCargado.value = true
      // console.log(v$.value)
    })
    onUnmounted(() => {
      // console.log('EmpleadoPage -> Desmontado')
    })

    return {
      mixin,
      empleado,
      disabled,
      accion,
      acciones,
      refArchivo,
      v$,
      componenteCargado,
      esRecursosHumanos: store.esRecursosHumanos,
      reestablecer_usuario,
      configuracionColumnas: configuracionColumnasEmpleados,
      idEmpleado,
      isPwd: ref(true),
      mostrarComponenteInformacionLicencia,
      refApellidos,
      //listados y filtros
      tabDefecto,
      tabOptions: tabOptionsProveedoresInternacionales,
      areas,
      filtrarAreas,
      bancos,
      filtrarBancos,
      cantones,
      filtrarCantones,
      cargos,
      filtrarCargos,
      departamentos,
      filtrarDepartamentos,
      empleados,
      filtrarEmpleados,
      grupos,
      filtrarGrupos,
      estadosCiviles,
      maskFecha,
      niveles_academicos,
      roles,
      filtrarRoles,
      talla_letras,
      tipos_sangre,
      tiposContratos,
      refFamiliares,
      optionsFecha,
      orientaciones_sexuales,
      identidades_genero,
      religiones,
      //metodos
      btnEliminarFamiliar,
      btnImprimirEmpleados,
      btnHabilitarEmpleado,
      btnDesHabilitarEmpleado,
      btnEliminarDiscapacidad,
      btnPlanVacaciones,
      modales,
      idsTiposDiscapacidades,
      idsParentescos,
      tiposDiscapacidades,
      //funciones
      subirArchivos,
      obtenerUsername,
      ordenarLista,
      verificarRolesSeleccionados,
      mostrarBotonSubirArchivos,
      filtrarListadoEmpleados,
      conductor,
      configuracionColumnasTipoDiscapacidadPorcentajeReactive,
      configuracionColumnasFamiliaresEmpleado,
      agregarDiscapacidad,
      agregarFamiliares,
      accionesTabla,
      construccionConfiguracionColumnas,
      habilitarBotonAgregarFamiliares,
      autoidentificaciones_etnicas
    }
  }
})
