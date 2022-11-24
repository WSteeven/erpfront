import { Endpoint } from 'shared/http/domain/Endpoint'

export const apiConfig = {
  URL_BALSE: process.env.VUE_APP_API_URL,
}

export const endpoints = {
  // autenticacion
  authentication: new Endpoint('sanctum/csrf-cookie', false),
  login: new Endpoint('usuarios/login'),
  logout: new Endpoint('usuarios/logout'),
  api_user: new Endpoint('user'),
  reset_password: new Endpoint('reset-password', false),
  perfil_usuario: new Endpoint('user/profile-information', false),
  cambiar_contrasena: new Endpoint('user/password', false),
  roles: new Endpoint('user/roles'),
  permisos: new Endpoint('user/permisos'),
  // acceso a modulos
  tareas: new Endpoint('tareas/'),
  subtareas: new Endpoint('subtareas/'),
  subtareas_asignadas: new Endpoint('subtareas-asignadas/'),
  pausas_subtareas: new Endpoint('subtareas/pausas'),
  tipos_trabajos: new Endpoint('tipos-trabajos/'),
  control_asistencias: new Endpoint('control-asistencias/'),
  control_cambios: new Endpoint('control-cambios/'),
  tipos_elementos: new Endpoint('tipos-elementos/'),
  clientes: new Endpoint('clientes/'),
  progresivas: new Endpoint('progresivas/'),
  grupos: new Endpoint('grupos/'),
  clientes_finales: new Endpoint('clientes-finales/'),
  //configuraciones: new Endpoint('configuraciones/'),
  tablero: new Endpoint('tablero/'),
  // ubicacion
  paises: new Endpoint('paises/'),
  provincias: new Endpoint('provincias/'),
  cantones: new Endpoint('cantones/'),

  //endpoints de RR HH
  activos_fijos: new Endpoint('activos-fijos/'),
  //endpoints de RR HH
  empleados: new Endpoint('empleados/'),
  allroles: new Endpoint('roles/'),

  //endpoints de bodega
  autorizaciones: new Endpoint('autorizaciones/'),
  categorias: new Endpoint('categorias/'),
  condiciones: new Endpoint('condiciones/'),
  estados_transacciones: new Endpoint('estados/'),
  control_stocks: new Endpoint('control-stocks/'),
  codigos_clientes: new Endpoint('codigos-clientes/'),
  detalles: new Endpoint('detalles/'),
  detalle_producto_transaccion: new Endpoint('detalles-productos-transacciones/'),
  discos: new Endpoint('discos/'),
  rams: new Endpoint('rams/'),
  inventarios: new Endpoint('inventarios/'),
  hilos: new Endpoint('hilos/'),
  marcas: new Endpoint('marcas/'),
  modelos: new Endpoint('modelos/'),
  movimientos: new Endpoint('movimientos-productos/'),
  procesadores: new Endpoint('procesadores/'),
  prestamos: new Endpoint('prestamos/'),
  productos: new Endpoint('productos/'),
  productos_perchas: new Endpoint('productos-perchas/'),
  sucursales: new Endpoint('sucursales/'),
  spans: new Endpoint('spans/'),
  tipos_fibras: new Endpoint('tipos-fibras/'),
  tipos_transacciones: new Endpoint('tipos-transacciones/'),
  transacciones: new Endpoint('transacciones/'),
  transacciones_egresos: new Endpoint('transacciones-egresos/'),
  transacciones_ingresos: new Endpoint('transacciones-ingresos/'),
  subtipos_transacciones: new Endpoint('subtipos-transacciones/'),
  perchas: new Endpoint('perchas/'),
  pisos: new Endpoint('pisos/'),
  ubicaciones: new Endpoint('ubicaciones/'),

}
