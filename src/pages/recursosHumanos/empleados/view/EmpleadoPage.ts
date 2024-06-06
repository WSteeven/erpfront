//Dependencias
import { configuracionColumnasTipoDiscapacidadPorcentaje } from '../domain/configuracionColumnasTipoDiscapacidadPorcentaje'
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
  opcionesEstados,
  talla_letras,
  tipos_sangre,
} from 'config/utils'
import { defineComponent, ref, watchEffect, computed, Ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RolController } from 'pages/administracion/roles/infraestructure/RolController'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { EmpleadoController } from '../infraestructure/EmpleadoController'
import { useNotificacionStore } from 'stores/notificacion'
import { Empleado } from '../domain/Empleado'
import { useQuasar } from 'quasar'
import { CargoController } from 'pages/recursosHumanos/cargos/infraestructure/CargoController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { TipoContratoController } from 'pages/recursosHumanos/tipo-contrato/infraestructure/TipoContratoController'
import { DepartamentoController } from 'pages/recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { EstadoCivilController } from 'pages/recursosHumanos/estado-civil/infraestructure/EstadoCivilController'
import { AreasController } from 'pages/recursosHumanos/areas/infraestructure/AreasController'
import { BancoController } from 'pages/recursosHumanos/banco/infrestruture/BancoController'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import { configuracionColumnasFamiliaresEmpleado } from 'pages/recursosHumanos/familiares/domain/configuracionColumnasFamiliaresEmpleado'
import { ComportamientoModalesEmpleado } from '../application/ComportamientoModalesEmpleado'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useFamiliarStore } from 'stores/familiar'
import { useAuthenticationStore } from 'stores/authentication'
import { Familiares } from 'pages/recursosHumanos/familiares/domain/Familiares'
import { FamiliaresController } from 'pages/recursosHumanos/familiares/infraestructure/FamiliaresController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { encontrarUltimoIdListado, imprimirArchivo } from 'shared/utils'
import { useCargandoStore } from 'stores/cargando'
import { AxiosResponse } from 'axios'
import { useNotificaciones } from 'shared/notificaciones'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { TipoDiscapacidadController } from 'pages/recursosHumanos/tipo-discapacidad/infraestructure/TipoDiscapacidadController'
import { TipoDiscapacidadPorcentaje } from '../domain/TipoDiscapacidadPorcentaje'
import { TipoDiscapacidad } from 'pages/recursosHumanos/tipo-discapacidad/domain/TipoDiscapacidad'
import { reactive } from 'vue'
import {
  autoidentificaciones_etnicas,
  parentezcos,
} from 'config/recursosHumanos.utils'
import { OrientacionSexualController } from 'pages/medico/gestionarPacientes/modules/fichaPeriodica/infraestructure/OrientacionSexualController'
import { IdentidadGeneroController } from 'pages/medico/gestionarPacientes/modules/fichaPeriodica/infraestructure/IdentidadGeneroController'
import { ReligionController } from 'pages/medico/gestionarPacientes/modules/fichaPeriodica/infraestructure/ReligionController'

export default defineComponent({
  components: {
    TabLayout,
    SelectorImagen,
    ModalesEntidad,
    EssentialTable,
    GestorArchivos,
  },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const { notificarCorrecto, confirmar } = useNotificaciones()

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
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } =
      mixin.useComportamiento()
    const { onConsultado, onGuardado, onReestablecer } = mixin.useHooks()

    /************
     * Variables
     ************/
    const configuracionColumnasTipoDiscapacidadPorcentajeReactive = reactive(
      configuracionColumnasTipoDiscapacidadPorcentaje
    )
    const opciones_cantones = ref([])
    const opciones_roles = ref([])
    const opciones_cargos = ref([])
    const opciones_empleados = ref([])
    const estado_civiles = ref([])
    const bancos = ref([])
    const areas = ref([])
    const tipos_contrato = ref([])
    const tiposDiscapacidades = ref([])
    const opcionesDepartamentos = ref([])
    const orientaciones_sexuales = ref([])
    const identidades_genero = ref([])
    const religiones = ref([])
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

    const refArchivo = ref()
    const idEmpleado = ref()
    const idsTiposDiscapacidades: Ref<number[]> = ref([])
    const idsParentescos: Ref<number[]> = ref([])
    const construccionConfiguracionColumnas = ref(false)
    cargarVista(async () => {
      await obtenerListados({
        cantones: new CantonController(),
        cargos: {
          controller: new CargoController(),
          params: { estado: 1 },
        },
        tipos_contrato: new TipoContratoController(),
        roles: {
          controller: new RolController(),
          params: { campos: 'id,name' },
        },
        tiposDiscapacidades: {
          controller: new TipoDiscapacidadController(),
          params: { campos: 'id,nombres' },
        },

        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1,
          },
        },
        estado_civiles: new EstadoCivilController(),
        bancos: new BancoController(),
        areas: new AreasController(),
        grupos: {
          controller: new GrupoController(),
          params: { activo: 1 },
        },
        departamentos: {
          controller: new DepartamentoController(),
          params: { activo: 1 },
        },
        orientaciones_sexuales: new OrientacionSexualController(),
        identidades_genero: new IdentidadGeneroController(),
        religiones: new ReligionController(),
      })

      configuracionColumnasTipoDiscapacidadPorcentajeReactive.find(
        (item) => item.field === 'tipo_discapacidad'
      )!.options = listadosAuxiliares.tiposDiscapacidades.map(
        (v: TipoDiscapacidad) => {
          return { label: v.nombre, value: v.id }
        }
      )
      configuracionColumnasFamiliaresEmpleado.find(
        (item) => item.field === 'parentezco'
      )!.options = parentezcos.map((v: any) => {
        return { label: v.nombre, value: v.value }
      })
      construccionConfiguracionColumnas.value = true
    })

    const habilitarBotonAgregarFamiliares = computed(
      () => accion.value == acciones.nuevo || accion.value == acciones.editar
    )

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
      autoidentificacion_etnica: { required },
      orientacion_sexual: { required },
      identidad_genero: { required },
      religion: { required },
    }

    const v$ = useVuelidate(reglas, empleado)
    setValidador(v$.value)
    const configuracionStore = useConfiguracionGeneralStore()
    opciones_cantones.value = listadosAuxiliares.cantones
    opciones_roles.value = listadosAuxiliares.roles
    opciones_cargos.value = listadosAuxiliares.cargos
    opciones_empleados.value = listadosAuxiliares.empleados
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
    onReestablecer(() => {
      empleado.familiares = []
    })

    onConsultado(() => {
      idEmpleado.value = empleado.id
      empleado.tiene_grupo = !!empleado.grupo
      nombre_usuario.value = empleado.usuario
      email_usuario.value = empleado.email
      setTimeout(() => {
        refArchivo.value.listarArchivosAlmacenados(empleado.id)
      }, 1)
    })

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
    const btnConsultarFamiliar: CustomActionTable = {
      titulo: '',
      icono: 'bi-eye',
      accion: ({ entidad }) => {
        familiarStore.idFamiliarSeleccionada = entidad.id
        familiarStore.idEmpleado = empleado.id
        familiarStore.accion = acciones.consultar
        modales.abrirModalEntidad('FamiliaresPage')
      },
    }
    const btnEditarFamiliar: CustomActionTable = {
      titulo: '',
      icono: 'bi-pencil',
      color: 'warning',
      visible: () => {
        return authenticationStore.can('puede.editar.familiares')
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
      titulo: 'Eliminar',
      icono: 'bi-x',
      color: 'negative',
      visible: () => authenticationStore.can('puede.eliminar.familiares'),
      accion: ({ posicion }) =>
        confirmar('¿Está seguro de continuar?', () =>
          empleado.familiares?.splice(posicion, 1)
        ),
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
          ),
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

    //  FILTROS
    //filtro de empleados
    function filtroEmpleados(val, update) {
      if (val === '') {
        update(() => {
          opciones_empleados.value = listadosAuxiliares.empleados
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        opciones_empleados.value = listadosAuxiliares.empleados.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    //filtro de cantones
    function filtroCantones(val, update) {
      if (val === '') {
        update(() => {
          opciones_cantones.value = listadosAuxiliares.cantones
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        opciones_cantones.value = listadosAuxiliares.cantones.filter(
          (v) => v.canton.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    //filtro de cargos
    function filtroCargos(val, update) {
      if (val === '') {
        update(() => {
          opciones_cargos.value = listadosAuxiliares.cargos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        opciones_cargos.value = listadosAuxiliares.cargos.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function filtroRoles(val, update) {
      if (val === '') {
        update(() => {
          opciones_roles.value = listadosAuxiliares.roles
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        opciones_roles.value = listadosAuxiliares.roles.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function filtroDepartamentos(val, update) {
      if (val === '') {
        update(() => {
          opcionesDepartamentos.value = listadosAuxiliares.departamentos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        opcionesDepartamentos.value = listadosAuxiliares.departamentos.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function filtrobancos(val, update) {
      if (val === '') {
        update(() => {
          bancos.value = listadosAuxiliares.bancos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        opcionesDepartamentos.value = listadosAuxiliares.bancos.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function filtrarTipoDiscapacidad(val, update) {
      if (val === '') {
        update(() => {
          tiposDiscapacidades.value = listadosAuxiliares.tiposDiscapacidades
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tiposDiscapacidades.value =
          listadosAuxiliares.tiposDiscapacidades.filter(
            (v) => v.nombre.toLowerCase().indexOf(needle) > -1
          )
      })
    }

    return {
      mixin,
      mixinFamiliares,
      empleado,
      disabled,
      accion,
      acciones,
      refArchivo,
      v$,
      reestablecer_usuario,
      configuracionColumnas: configuracionColumnasEmpleados,
      idEmpleado,
      isPwd: ref(true),
      listadosAuxiliares,
      //listado
      opciones_cantones,
      opciones_roles,
      opciones_cargos,
      opciones_empleados,
      opcionesEstados,
      bancos,
      tipos_sangre,
      talla_letras,
      maskFecha,
      estado_civiles,
      areas,
      tipos_contrato,
      niveles_academicos,
      refFamiliares,
      optionsFecha,
      orientaciones_sexuales,
      identidades_genero,
      religiones,
      //metodos
      opcionesDepartamentos,
      btnConsultarFamiliar,
      btnEditarFamiliar,
      btnEliminarFamiliar,
      btnImprimirEmpleados,
      btnHabilitarEmpleado,
      btnDesHabilitarEmpleado,
      btnEliminarDiscapacidad,
      modales,
      idsTiposDiscapacidades,
      idsParentescos,
      tiposDiscapacidades,
      //funciones
      subirArchivos,
      obtenerUsername,
      filtroEmpleados,
      filtroCantones,
      filtroCargos,
      filtroRoles,
      filtroDepartamentos,
      filtrobancos,
      filtrarTipoDiscapacidad,
      configuracionColumnasTipoDiscapacidadPorcentajeReactive,
      configuracionColumnasFamiliaresEmpleado,
      agregarDiscapacidad,
      agregarFamiliares,
      accionesTabla,
      construccionConfiguracionColumnas,
      habilitarBotonAgregarFamiliares,
      autoidentificaciones_etnicas,
    }
  },
})
