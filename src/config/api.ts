import { Endpoint } from 'src/pages/shared/http/domain/Endpoint'

export const apiConfig = {
  URL_BALSE: process.env.VUE_APP_API_URL,
}

export const endpoints = {
  // autenticacion
  authentication: new Endpoint('sanctum/csrf-cookie', false),
  login: new Endpoint('api/usuarios/login', false),
  api_user: new Endpoint('api/user', false),
  reset_password: new Endpoint('reset-password', false),
  perfil_usuario: new Endpoint('user/profile-information', false),
  cambiar_contrasena: new Endpoint('user/password', false),
  logout: new Endpoint('logout', false),
  permisos: new Endpoint('permisos'),
  seleccionar_negocio: new Endpoint('seleccionar-negocio'),
  // acceso a modulos
  negocios: new Endpoint('negocios/'),
  clientes: new Endpoint('clientes/'),
  proveedores: new Endpoint('proveedores/'),
  productos: new Endpoint('productos/'),
  categorias_productos: new Endpoint('categorias_productos/'),
  tipos_negocios: new Endpoint('tipos-negocios/'),
  // ubicacion
  paises: new Endpoint('paises/'),
  provincias: new Endpoint('provincias/'),
  ciudades: new Endpoint('ciudades/'),
}
