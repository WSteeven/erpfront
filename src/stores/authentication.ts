import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { ApiError } from 'shared/error/domain/ApiError'
import { rolesSistema, tipoAutenticacion } from 'config/utils'
import { endpoints } from 'src/config/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { LocalStorage } from 'quasar'
import { AxiosError, AxiosResponse } from 'axios'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { ForgotPassword } from 'sistema/authentication/forgotPassword/domain/ForgotPassword'
import { ResetPassword } from 'sistema/authentication/resetPassword/domain/ResetPassword'
import { UltimoSaldoController } from 'pages/fondosRotativos/reportes/reporteSaldoActual/infrestucture/UltimoSaldoController'
import { UserLogin } from 'sistema/authentication/login/domain/UserLogin'
import { useListadosSistemaStore } from './listadosSistema'

export const useAuthenticationStore = defineStore('authentication', () => {
  // Variables locales
  const axios = AxiosHttpRepository.getInstance()
  let usuarioFueConsultado = false
  const listadosSistemaStore = useListadosSistemaStore()

  // State
  const user = ref()
  const auth = ref(false)
  const roles = ref()
  const permisos = ref()
  const nombre_usuario = ref() // Para resetear clave
  const saldo_actual = ref(0)
  const nombreUsuario = computed(
    () =>
      `${user.value?.nombres}${user.value?.apellidos ? ' ' + user.value.apellidos : ''
      }`
  )

  const esCoordinador = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.coordinador) : false)
  const esCoordinadorBackup = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.coordinadorBackup) : false)
  const esCoordinadorBodega = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.coordinadorBodega) : false)
  const esFiscalizador = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.fiscalizador) : false)
  const esJefeTecnico = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.jefe_tecnico) : false)
  const esSupervisorCampo = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.supervisor) : false)
  const esTecnicoLider = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.tecnico_lider) : false)
  const esBodeguero = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.bodega) : false)
  const esBodegueroTelconet = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.bodegaTelconet) : false)
  const esActivosFijos = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.activos_fijos) : false)
  const esTecnico = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.tecnico) : false)
  const esRecursosHumanos = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.rrhh) : false)
  const esGerente = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.gerente) : false)
  const esContabilidad = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.contabilidad) : false)
  const esCompras = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.compras) : false)
  const esAdministrador = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.administrador) : false)
  const esAdministradorVehiculos = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.administradorVehiculos) : false)
  const esSupervisorTecnico = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.esSupervisorTecnico) : false)
  //ventas
  const esJefeVentasClaro = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.jefe_ventas) : false)
  const esSupervisorVentasClaro = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.supervisor_ventas) : false)
  const esVendedor = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.vendedor) : false)

  const esMedico = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.medico) : false)
  const esMecanicoGeneral = computed(() => user.value ? extraerRol(user.value.roles, rolesSistema.mecanicoGeneral) : false)

  function extraerRol(roles: string[], rolConsultar: string) {
    return roles.some((rol: string) => rol === rolConsultar)
  }

  // Actions
  const login = async (
    credentiales: UserLogin
  ): Promise<Empleado> => {
    try {
      /*const csrf_cookie = axios.getEndpoint(endpoints.csrf_cookie)
      console.log('authentication...')
      await axios.get(csrf_cookie) */

      const login = axios.getEndpoint(endpoints.login)
      const response: AxiosResponse = await axios.post(login, credentiales)
      // console.log(response)
      LocalStorage.set('token', response.data.access_token)
      LocalStorage.set('method_access', tipoAutenticacion.empleado)
      setUser(response.data.modelo)
      roles.value = response.data.modelo.roles
      permisos.value = response.data.modelo.permisos

      listadosSistemaStore.cargarDatosLS()

      return response.data.modelo
    } catch (error: unknown) {
      console.log(error)

      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }

   // Actions
  //  const loginPostulante = async (credentiales: UserLoginPostulante): Promise<Empleado> => {
  //   try {
      /*const csrf_cookie = axios.getEndpoint(endpoints.csrf_cookie)
      console.log('authentication...')
      await axios.get(csrf_cookie) */

  //     const login = axios.getEndpoint(endpoints.login)
  //     const response: AxiosResponse = await axios.post(login, credentiales)

  //     LocalStorage.set('token', response.data.access_token)
  //     setUser(response.data.modelo)
  //     roles.value = response.data.modelo.roles
  //     permisos.value = response.data.modelo.permisos

  //     listadosSistemaStore.cargarDatosLS()

  //     return response.data.modelo
  //   } catch (error: unknown) {
  //     console.log(error)

  //     const axiosError = error as AxiosError
  //     throw new ApiError(axiosError)
  //   }
  // }
  const enviarCorreoRecuperacion = async (userLogin: ForgotPassword) => {
    try {
      await axios.post(
        axios.getEndpoint(endpoints.enviar_correo_recuperacion),
        userLogin
      )
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }
  const recuperacionCuenta = async (userLogin: ForgotPassword) => {
    try {
      await axios.post(
        axios.getEndpoint(endpoints.recuperacion_cuenta),
        userLogin
      )
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }
  async function consultar_saldo_actual() {
    try {
      const ultimo_saldo = new UltimoSaldoController()
      if (user.value.id) {
        const { response } = await ultimo_saldo.consultar(user.value.id)
        const saldo_actual = response.data.saldo_actual
        setSaldo(saldo_actual)
        return saldo_actual
      }
    } catch (e) {
      setSaldo(0)
    }
  }

  async function logout() {
    await axios.post(axios.getEndpoint(endpoints.logout))
    LocalStorage.remove('token')
    LocalStorage.remove('method_access')
    listadosSistemaStore.limpiarLS()
    await getUser()
    document.title = 'JPCONSTRUCRED'
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
    console.log('auth...')
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
      const response = await axios.get<AxiosResponse>(
        axios.getEndpoint(endpoints.usuarios)
      )
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
    roles,
    permisos,
    can,
    getUser,
    getNombreusuario,
    setNombreusuario,
    actualizarContrasena,
    isUserLoggedIn,
    esCoordinador,
    esCoordinadorBackup,
    esCoordinadorBodega,
    esJefeTecnico,
    esTecnico,
    esTecnicoLider,
    esBodeguero,
    esBodegueroTelconet,
    esActivosFijos,
    esRecursosHumanos,
    esGerente,
    esCompras, esContabilidad, esAdministrador, esAdministradorVehiculos, esMecanicoGeneral, esSupervisorTecnico,
    esJefeVentasClaro, esSupervisorVentasClaro, esVendedor,
    esFiscalizador,
    esSupervisorCampo,
    esMedico,
    consultar_saldo_actual,
    extraerRol,
    listadoUsuarios,

  }
})
