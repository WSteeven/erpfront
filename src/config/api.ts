import { Endpoint } from 'shared/http/domain/Endpoint'

export const apiConfig = {
  URL_BALSE: process.env.VUE_APP_API_URL,
}

export const endpoints = {
  // autenticacion
  authentication: new Endpoint('sanctum/csrf-cookie', false),
  login: new Endpoint('login', false),
  api_user: new Endpoint('api/user', false),
  reset_password: new Endpoint('reset-password', false),
  perfil_usuario: new Endpoint('user/profile-information', false),
  cambiar_contrasena: new Endpoint('user/password', false),
  logout: new Endpoint('logout', false),
  permisos: new Endpoint('user/permisos'),
  // acceso a modulos
  tareas: new Endpoint('tareas/'),
  subtareas: new Endpoint('subtareas/'),
  tipos_tareas: new Endpoint('tipos-tareas/'),
  control_asistencias: new Endpoint('control-asistencias/'),
  control_cambios: new Endpoint('control-cambios/'),
  tipos_elementos: new Endpoint('tipos-elementos/'),
  clientes: new Endpoint('clientes/'),
  progresivas: new Endpoint('progresivas/'),
  // ubicacion
  paises: new Endpoint('paises/'),
  provincias: new Endpoint('provincias/'),
  ciudades: new Endpoint('ciudades/'),

  //endpoints de bodega
  autorizaciones: new Endpoint('autorizaciones/'),
  categorias: new Endpoint('categorias/'),
  condiciones: new Endpoint('condiciones/'),
  codigos_clientes: new Endpoint('codigos-clientes/'),
  detalles: new Endpoint('detalles/'),
  inventarios: new Endpoint('inventarios/'),
  hilos: new Endpoint('hilos/'),
  marcas: new Endpoint('marcas/'),
  modelos: new Endpoint('modelos/'),
  productos: new Endpoint('productos/'),
  sucursales: new Endpoint('sucursales/'),
  tipos_fibras: new Endpoint('tipos-fibras/'),
  tipos_transacciones: new Endpoint('tipos-transacciones/'),
  subtipos_transacciones: new Endpoint('subtipos-transacciones/'),
  perchas: new Endpoint('perchas/'),
  pisos: new Endpoint('pisos/'),
  ubicaciones: new Endpoint('ubicaciones/'),
  
}
