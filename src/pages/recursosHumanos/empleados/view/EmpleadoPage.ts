//Dependencias
import { configuracionColumnasEmpleados } from '../domain/configuracionColumnasEmpleados'
import {
  maxLength,
  minLength,
  numeric,
  required,
  requiredIf,
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
  tipos_sangre,
} from 'config/utils'
import { defineComponent, ref, watchEffect, computed, reactive, onMounted } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
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
import { useFamiliarStore } from 'stores/familiar'
import { useAuthenticationStore } from 'stores/authentication'
import { Familiares } from 'pages/recursosHumanos/familiares/domain/Familiares'
import { FamiliaresController } from 'pages/recursosHumanos/familiares/infraestructure/FamiliaresController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { imprimirArchivo, ordenarLista } from 'shared/utils'
import { useCargandoStore } from 'stores/cargando'
import { AxiosResponse } from 'axios'
import { useNotificaciones } from 'shared/notificaciones'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { Conductor } from 'vehiculos/conductores/domain/Conductor'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { ValidarChofer } from '../application/ValidarChofer'

export default defineComponent({
  components: {
    TabLayout,
    SelectorImagen,
    ModalesEntidad,
    EssentialTable,
    GestorArchivos,
    InformacionLicencia,
  },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const { notificarCorrecto } = useNotificaciones()

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController(), new ArchivoController())
    const {
      entidad: empleado,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } =
      mixin.useComportamiento()
    const { onConsultado, onGuardado, onReestablecer } = mixin.useHooks()

    //   console.log(refArchivo.value)
    //   return refArchivo.value.quiero_subir_archivos==true
    // })
    const conductor = reactive(new Conductor())
    /********************************
     * LISTADOS Y FILTROS
     ********************************/
    const { empleados, filtrarEmpleados,
      cantones, filtrarCantones,
      cargos, filtrarCargos,
      roles, filtrarRoles,
      tiposContratos,
      estadosCiviles,
      bancos, filtrarBancos,
      areas, filtrarAreas,
      grupos, filtrarGrupos,
      departamentos, filtrarDepartamentos
    } = useFiltrosListadosSelects(listadosAuxiliares)
    const refFamiliares = ref()
    const modales = new ComportamientoModalesEmpleado()
    const familiarStore = useFamiliarStore()
    const authenticationStore = useAuthenticationStore()
    const nombre_usuario = ref()
    const email_usuario = ref()
    const mixinFamiliares = new ContenedorSimpleMixin(
      Familiares,
      new FamiliaresController()
    )
    const { eliminar } = mixinFamiliares.useComportamiento()

    // const mostrarBotonSubirArchivos = ref(false) //computed(()=>{
    const mostrarComponenteInformacionLicencia = ref(false)
    const refArchivo = ref()
    const mostrarBotonSubirArchivos = computed(() => refArchivo.value != undefined ? refArchivo.value.quiero_subir_archivos : false)
    const idEmpleado = ref()

    cargarVista(async () => {
      obtenerListados({
        areas: new AreasController(),
        bancos: new BancoController(),
        cargos: {
          controller: new CargoController(),
          params: { estado: 1 },
        },
        departamentos: {
          controller: new DepartamentoController(),
          params: { activo: 1 },
        },
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1,
          },
        },
        estados_civiles: new EstadoCivilController(),
        grupos: {
          controller: new GrupoController(),
          params: { activo: 1 },
        },
        tipos_contratos: new TipoContratoController(),
        roles: {
          controller: new RolController(),
          params: { campos: 'id,name' },
        },
      })
    }).then(()=>{
      listadosAuxiliares.cantones = JSON.parse(LocalStorage.getItem('cantones')!.toString())
      areas.value = listadosAuxiliares.areas
      bancos.value = listadosAuxiliares.bancos
      cantones.value = listadosAuxiliares.cantones
      cargos.value = listadosAuxiliares.cargos
      departamentos.value = listadosAuxiliares.departamentos
      empleados.value = listadosAuxiliares.empleados
      estadosCiviles.value = listadosAuxiliares.estados_civiles
      grupos.value = listadosAuxiliares.grupos
      roles.value = listadosAuxiliares.roles
      tiposContratos.value = listadosAuxiliares.tipos_contratos
    })
    /***************************
     * Configuracion de columnas
     ****************************/
    const columnasFamiliares: any = [
      ...configuracionColumnasFamiliaresEmpleado,
      accionesTabla,
    ]
    /*************
     * Validaciones
     **************/
    const reglas = {
      identificacion: {
        required,
        minlength: minLength(10),
        maxlength: maxLength(10),
      },
      telefono: {
        required,
        numeric,
        minlength: minLength(10),
        maxlength: maxLength(10),
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
        required: requiredIf(() => {
          return accion.value === 'EDITAR'
        }),
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
      talla_guantes: { required: requiredIf(() => empleado.tiene_grupo) },
    }

    const v$ = useVuelidate(reglas, empleado)
    setValidador(v$.value)

    const validarConductor = new ValidarChofer(empleado, conductor)
    mixin.agregarValidaciones(validarConductor)

    const configuracionStore = useConfiguracionGeneralStore()
    areas.value = listadosAuxiliares.areas
    bancos.value = listadosAuxiliares.bancos
    /********
     * Hooks
     ********/


    async function guardado(data) {
      empleado.familiares!.push(data.model)
    }
    onReestablecer(()=>{
      refArchivo.value.limpiarListado()
      verificarRolesSeleccionados()
    })
    onConsultado(() => {
      idEmpleado.value = empleado.id
      empleado.tiene_grupo = !!empleado.grupo
      nombre_usuario.value = empleado.usuario
      email_usuario.value = empleado.email
      
      
      // listar archivos
      setTimeout(() => {
        refArchivo.value.listarArchivosAlmacenados(empleado.id)
      }, 1);

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
    const abrirModalFamiliares: CustomActionTable = {
      titulo: 'Agregar Familiar',
      icono: 'bi-person-fill-add',
      color: 'positive',
      tooltip:
        'Puede modificar o eliminar un familiar desde el panel familiares de empleados',
      accion: () => {
        familiarStore.idEmpleado = empleado.id
        familiarStore.listar_familiares = false
        familiarStore.accion = acciones.nuevo

        modales.abrirModalEntidad('FamiliaresPage')
      },
      visible: () => {
        return accion.value == acciones.nuevo || accion.value == acciones.editar
      },
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
    const btnConsultarFamiliar: CustomActionTable = {
      titulo: '',
      icono: 'bi-eye',
      accion: ({ entidad }) => {
        familiarStore.idFamiliarSeleccionada = entidad.id
        familiarStore.idEmpleado = empleado.id
        familiarStore.accion = acciones.consultar
        modales.abrirModalEntidad('FamiliaresPage')
      },
      visible: () => accion.value == acciones.consultar
    }
    const btnEditarFamiliar: CustomActionTable = {
      titulo: '',
      icono: 'bi-pencil',
      color: 'warning',
      visible: () => {
        return authenticationStore.can('puede.editar.familiares') && accion.value == acciones.consultar
      },
      accion: ({ entidad }) => {
        familiarStore.idFamiliarSeleccionada = entidad.id
        familiarStore.idEmpleado = empleado.id
        familiarStore.nombres = entidad.nombres
        familiarStore.apellidos = entidad.apellidos
        familiarStore.identificacion = entidad.identificacion
        familiarStore.parentezco = entidad.parentezco
        familiarStore.accion = acciones.editar
        modales.abrirModalEntidad('FamiliaresPage')
      },
    }
    const btnEliminarFamiliar: CustomActionTable = {
      titulo: '',
      icono: 'bi-trash',
      color: 'secondary',
      visible: () => authenticationStore.can('puede.eliminar.familiares'),
      accion: ({ entidad }) => {
        accion.value = 'ELIMINAR'
        eliminar(entidad)
      },
    }
    const btnImprimirEmpleados: CustomActionTable = {
      titulo: 'Reporte General',
      icono: 'bi-printer',
      color: 'primary',
      visible: ({ entidad }) => authenticationStore.can('puede.ver.empleados'),
      accion: () => {
        generar_reporte_general()
      },
    }
    async function generar_reporte_general(): Promise<void> {
      console.log('generar_reporte_general')
      const axios = AxiosHttpRepository.getInstance()
      const filename = 'empleados'
      const url_pdf =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.imprimir_reporte_general_empleado)
      imprimirArchivo(url_pdf, 'GET', 'blob', 'pdf', filename, null)
    }

    const btnHabilitarEmpleado: CustomActionTable = {
      titulo: '',
      icono: 'bi-toggle2-on',
      color: 'negative',
      tooltip: 'Habilitar',
      visible: ({ entidad }) =>
        !entidad.estado && authenticationStore.can('puede.activar.empleados'),
      accion: ({ entidad }) => {
        HabilitarEmpleado(entidad.id, true)
        entidad.estado = true
      },
    }
    const btnDesHabilitarEmpleado: CustomActionTable = {
      titulo: '',
      icono: 'bi-toggle2-off',
      color: 'positive',
      tooltip: 'DesHabilitar',
      visible: ({ entidad }) =>
        entidad.estado && authenticationStore.can('puede.desactivar.empleados'),
      accion: ({ entidad }) => {
        HabilitarEmpleado(entidad.id, false)
        entidad.estado = false
      },
    }
    function reestablecer_usuario() {
      if (accion.value == acciones.editar && empleado.generar_usuario) {
        generarUsename()
      } else {
        empleado.usuario = nombre_usuario.value
        empleado.email = email_usuario.value
      }
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
        usuario: empleado.usuario,
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
        estado: estado,
      })
      const response: AxiosResponse = await axios.get(ruta)
      notificarCorrecto(
        estado ? 'Ha Habilitado empleado' : 'Ha deshabilitado empleado'
      )
    }

    function verificarRolesSeleccionados() {
      if (empleado.roles.includes(rolesSistema.chofer)) {
        mostrarComponenteInformacionLicencia.value = true
      } else mostrarComponenteInformacionLicencia.value = false
    }
    return {
      mixin, mixinFamiliares,
      empleado,
      disabled,
      accion,
      acciones,
      refArchivo,
      v$,
      reestablecer_usuario,
      configuracionColumnas: configuracionColumnasEmpleados,
      columnasFamiliares,
      idEmpleado,
      isPwd: ref(true),
      mostrarComponenteInformacionLicencia,
      //listados y filtros
      areas,
      bancos, filtrarBancos,
      cantones, filtrarCantones,
      cargos, filtrarCargos,
      departamentos, filtrarDepartamentos,
      empleados, filtrarEmpleados,
      grupos, filtrarGrupos,
      estadosCiviles,
      maskFecha,
      niveles_academicos,
      roles, filtrarRoles,
      talla_letras,
      tipos_sangre,
      tiposContratos,
      refFamiliares,
      optionsFecha,
      abrirModalFamiliares,
      //metodos
      btnConsultarFamiliar,
      btnEditarFamiliar,
      btnEliminarFamiliar,
      btnImprimirEmpleados,
      btnHabilitarEmpleado,
      btnDesHabilitarEmpleado,
      modales,
      //funciones
      subirArchivos,
      obtenerUsername,
      guardado,
      ordenarLista,
      verificarRolesSeleccionados,
      mostrarBotonSubirArchivos,

      conductor,
    }
  },
})
