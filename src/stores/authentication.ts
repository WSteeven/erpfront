import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { UserLogin } from 'src/pages/sistema/authentication/login/domain/UserLogin'
import { ApiError } from 'shared/error/domain/ApiError'
import { rolesSistema } from 'config/utils'
import { endpoints } from 'src/config/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { LocalStorage } from 'quasar'
import { AxiosError, AxiosResponse } from 'axios'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { EstadosTransaccionController } from 'pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { CondicionController } from 'pages/administracion/condiciones/infraestructure/CondicionController'
import { ForgotPassword } from 'sistema/authentication/forgotPassword/domain/ForgotPassword'
import { ResetPassword } from 'sistema/authentication/resetPassword/domain/ResetPassword'
import { DetalleFondo } from 'pages/fondosRotativos/detalleFondo/domain/DetalleFondo'
import { DetalleFondoController } from 'pages/fondosRotativos/detalleFondo/infrestructure/DetalleFondoController'
import { SubDetalleFondoController } from 'pages/fondosRotativos/subDetalleFondo/infrestructure/SubDetalleFondoController'
import { UsuarioAutorizadoresController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioAutorizadoresController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'

export const useAuthenticationStore = defineStore('authentication', () => {
  // Variables locales
  const axios = AxiosHttpRepository.getInstance()
  let usuarioFueConsultado = false

  // State
  const user = ref()
  const auth = ref(false)
  const permisos = ref()
  const nombre_usuario = ref()
  const saldo_actual = ref(0)
  const nombreUsuario = computed(
    () =>
      `${user.value?.nombres}${user.value?.apellidos ? ' ' + user.value.apellidos : ''
      }`
  )

  const esCoordinador = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.coordinador) : false)
  const esCoordinadorBackup = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.coordinadorBackup) : false)
  const esJefeTecnico = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.jefe_tecnico) : false)
  const esTecnicoLider = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.tecnico_lider) : false)
  const esBodeguero = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.bodega) : false)
  const esActivosFijos = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.activos_fijos) : false)
  const esTecnico = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.tecnico) : false)
  const esRecursosHumanos = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.rrhh) : false)
  const esGerente = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.gerente) : false)
  const esContabilidad = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.contabilidad) : false)
  const esAdministrador = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.administrador) : false)
  const esCompras = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.compras) : false)

  function extraerRol(roles: string[], rolConsultar: string) {
    return roles.some((rol: string) => rol === rolConsultar)
  }

  // Actions
  const login = async (credentiales: UserLogin): Promise<Empleado> => {
    try {
      /*const csrf_cookie = axios.getEndpoint(endpoints.csrf_cookie)
      console.log('authentication...')
      await axios.get(csrf_cookie) */


      const login = axios.getEndpoint(endpoints.login)
      const response: AxiosResponse = await axios.post(login, credentiales)

      LocalStorage.set('token', response.data.access_token)
      setUser(response.data.modelo)
      permisos.value = response.data.modelo.permisos

      cargarDatosLS()

      return response.data.modelo
    } catch (error: unknown) {
      console.log(error);

      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }
  const enviarCorreoRecuperacion = async (userLogin: ForgotPassword) => {
    try {
      await axios.post(axios.getEndpoint(endpoints.enviar_correo_recuperacion), userLogin)
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }
  const recuperacionCuenta = async (userLogin: ForgotPassword) => {
    try {
      await axios.post(axios.getEndpoint(endpoints.recuperacion_cuenta), userLogin)
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }
  async function consultar_saldo_actual() {
    try {
      const userApi = axios.getEndpoint(endpoints.ultimo_saldo) + user.value?.id

      const response = await axios.get<AxiosResponse>(userApi)

      setSaldo(response.data.saldo_actual)
      return response.data.saldo_actual

    } catch (e) {
      setSaldo(0)
    }

  }


  /**
   * Función para cargar datos en el Local Storage
   */
  async function cargarDatosLS() {
    const autorizaciones = (await new AutorizacionController().listar({ campos: 'id,nombre' })).result
    LocalStorage.set('autorizaciones', JSON.stringify(autorizaciones))
    const sucursales = (await new SucursalController().listar({ campos: 'id,lugar' })).result
    LocalStorage.set('sucursales', JSON.stringify(sucursales))
    const condiciones = (await new CondicionController().listar({ campos: 'id,nombre' })).result
    LocalStorage.set('condiciones', JSON.stringify(condiciones))
    const estados_transacciones = (await new EstadosTransaccionController().listar({ campos: 'id,nombre' })).result
    LocalStorage.set('estados_transacciones', JSON.stringify(estados_transacciones))
    const cantones = (await new CantonController().listar({ campos: 'id,canton' })).result
    LocalStorage.set('cantones', JSON.stringify(cantones))
    const detalles = (await new DetalleFondoController().listar({ campos: 'id,descripcion' })).result
    LocalStorage.set('detalles', JSON.stringify(detalles))
    const sub_detalles = (await new SubDetalleFondoController().listar({ campos: 'id,descripcion' })).result
    LocalStorage.set('sub_detalles', JSON.stringify(sub_detalles))
    const autorizacionesEspeciales = (await new UsuarioAutorizadoresController().listar({ campos: 'id,nombre' })).result
    LocalStorage.set('autorizaciones_especiales', JSON.stringify(autorizacionesEspeciales))
    const tareas = (await new TareaController().listar({ campos: 'id,titulo' })).result
    LocalStorage.set('tareas', JSON.stringify(tareas))
    const usuariosInactivos = (await new EmpleadoController().listar({ campos: 'id,nombres,apellidos', estado: 0 })).result
    LocalStorage.set('usuariosInactivos', JSON.stringify(usuariosInactivos))
    // const sub_tareas = (await new SubtareaController().listar({ campos: 'id,titulo' })).result
    // LocalStorage.set('sub_tareas', JSON.stringify(sub_tareas))


  }
  /**
   * Función para limpiar los datos del Local Storage
   */
  function limpiarLS() {
    LocalStorage.remove('autorizaciones')
    LocalStorage.remove('sucursales')
    LocalStorage.remove('condiciones')
    LocalStorage.remove('estados_transacciones')
    LocalStorage.remove('lugares')
    LocalStorage.remove('detalles')
  }

  async function logout() {
    await axios.post(axios.getEndpoint(endpoints.logout))
    LocalStorage.remove('token')
    limpiarLS()
    await getUser()
  }

  const setUser = (userData: Empleado | null) => {
    user.value = userData
    auth.value = Boolean(userData)
  }
  const setSaldo = (saldo: number) => {
    saldo_actual.value = saldo
  }

  const setNombreusuario = (email: string) => {
    nombre_usuario.value = email
  }
  const getNombreusuario = () => {
    return nombre_usuario.value
  }

  const getUser = async () => {
    try {
      const userApi = axios.getEndpoint(endpoints.api_user)
      const response = await axios.get<AxiosResponse>(userApi)

      setUser(response.data)

      permisos.value = response.data.permisos
      return response.data

    } catch (e) {
      setUser(null)
    }
  }

  const actualizarContrasena = async (userReset: ResetPassword) => {
    try {
      await axios.post(axios.getEndpoint(endpoints.reset_password), userReset)
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }

  async function isUserLoggedIn(): Promise<boolean> {
    if (!usuarioFueConsultado) {
      await getUser()
      usuarioFueConsultado = true
    }
    return auth.value
  }

  function can(permiso: string) {
    return permisos.value?.indexOf(permiso) !== -1
  }

  async function listadoUsuarios() {
    try {
      const response = await axios.get<AxiosResponse>(axios.getEndpoint(endpoints.usuarios))
      return response.data.modelo
    } catch (e) {
      const axiosError = e as AxiosError
      throw new ApiError(axiosError)
    }
  }
  // console.log(user);


  return {
    user,
    nombre_usuario,
    saldo_actual,
    login,
    enviarCorreoRecuperacion,
    recuperacionCuenta,
    nombreUsuario,
    logout,
    permisos,
    can,
    getUser,
    getNombreusuario,
    setNombreusuario,
    actualizarContrasena,
    isUserLoggedIn,
    esCoordinador,
    esCoordinadorBackup,
    esJefeTecnico,
    esTecnico,
    esTecnicoLider,
    esBodeguero,
    esActivosFijos,
    esRecursosHumanos,
    esGerente,
    esCompras, esContabilidad, esAdministrador,
    consultar_saldo_actual,
    extraerRol,
    listadoUsuarios,
  }
})

