import { Endpoint } from 'shared/http/domain/Endpoint'
import { medico } from './endpoints/medico'
import { tareas } from './endpoints/tareas'
import { tickets } from './endpoints/tickets'
import { recursosHumanos } from './endpoints/rrhh/recursosHumanos'
import { activosFijos } from './endpoints/activosFijos'
import { comprasProveedores } from './endpoints/comprasProveedores'
import { vehiculos } from 'config/endpoints/vehiculos'
import { sso } from './endpoints/sso'
import { seguridad } from './endpoints/seguridad'
import { fondosRotativos } from 'config/endpoints/fondosRotativos'

export const apiConfig = {
  // URL_BASE: 'http://localhost:8000',
  URL_BASE: process.env.API_URL,
}

export const endpoints = {
  validar_cedula: new Endpoint('validar-cedula'),
  // Autenticacion
  csrf_cookie: new Endpoint('api/csrf-cookie', false),
  usuarios: new Endpoint('usuarios'),
  configuracion: new Endpoint('configuracion'),
  auditorias: new Endpoint('auditorias'),
  login: new Endpoint('usuarios/login'),
  login_externos: new Endpoint('usuarios-externos/login'),
  // login_terceros: new Endpoint('login-social-network/'),
  sesion_terceros: new Endpoint('auth-social'),
  logout: new Endpoint('usuarios/logout'),
  logout_postulante: new Endpoint('usuarios/logout-postulante'),
  cambiarContrasena: new Endpoint('usuarios/cambiar-contrasena'),
  enviar_correo_recuperacion: new Endpoint('usuarios/recuperar-password'),
  recuperacion_cuenta: new Endpoint('usuarios/validar-token'),
  api_user: new Endpoint('user'),
  api_user_postulante: new Endpoint('user-postulante'),
  reset_password: new Endpoint('usuarios/reset-password'),
  perfil_usuario: new Endpoint('user/profile-information', false),
  // cambiar_contrasena: new Endpoint('user/password', false),
  roles: new Endpoint('user/roles'),
  fecha: new Endpoint('obtener-fecha'),
  hora: new Endpoint('obtener-hora'),
  //configuraciones: new Endpoint('configuraciones'),
  tablero: new Endpoint('tablero'),
  // Permisos
  todos_permisos: new Endpoint('permisos'),
  permisos_roles_usuario: new Endpoint('permisos_roles_usuario'),
  permisos_administrar: new Endpoint('permisos_administrar'),
  asignar_permisos: new Endpoint('asignar-permisos'),
  asignar_permisos_individual: new Endpoint('asignar-permisos-usuario'),
  crear_permiso: new Endpoint('crear-permiso'),
  //Archivos
  actividades: new Endpoint('actividades'),
  archivos: new Endpoint('archivos'),
  // Ubicacion
  paises: new Endpoint('paises'),
  provincias: new Endpoint('provincias'),
  cantones: new Endpoint('cantones'),
  parroquias: new Endpoint('parroquias'),


  /********************
  * Modulo de  RR HH
  *********************/
  ...recursosHumanos,
  cargos: new Endpoint('cargos'),
  allroles: new Endpoint('roles'),
  forma_pago: new Endpoint('forma_pago'),

  /******************************
   * Modulo de Vehiculos
   ******************************/
  ...vehiculos,


  //Modulo de compras y proveedores
  ...comprasProveedores,
  empresas: new Endpoint('empresas'),
  proveedores: new Endpoint('proveedores'),


  // Modulo de Bodega
  autorizaciones: new Endpoint('autorizaciones'),
  categorias: new Endpoint('categorias'),
  condiciones: new Endpoint('condiciones'),
  comprobantes: new Endpoint('comprobantes'),
  estados_transacciones: new Endpoint('estados'),
  dashboard_bodega: new Endpoint('dashboard-bodega'),
  empleados_roles: new Endpoint('empleados-roles'), //con esta ruta se obtienen los empleados por el/los roles especificados
  empleados_permisos: new Endpoint('empleados-permisos'), //con esta ruta se obtienen los empleados por el/los permisos especificados
  control_stocks: new Endpoint('control-stocks'),
  items_control_stocks_consolidados: new Endpoint('control-stocks/items-consolidados'),
  codigos_clientes: new Endpoint('codigos-clientes'),
  detalles_materiales: new Endpoint('detalles-materiales'),
  detalles: new Endpoint('detalles'),
  permisos_armas: new Endpoint('permisos-armas'),
  devoluciones: new Endpoint('devoluciones'),
  detalle_producto_transaccion: new Endpoint(
    'detalles-productos-transacciones'
  ),
  discos: new Endpoint('discos'),
  comprobantes_filtrados: new Endpoint('comprobantes-filtrados'),
  egresos_filtrados: new Endpoint('egresos-filtrados'),
  rams: new Endpoint('rams'),
  inventarios: new Endpoint('inventarios'),
  hilos: new Endpoint('hilos'),
  marcas: new Endpoint('marcas'),
  modelos: new Endpoint('modelos'),
  movimientos: new Endpoint('movimientos-productos'),
  motivos: new Endpoint('motivos'),
  notificaciones: new Endpoint('notificaciones'),
  pedidos: new Endpoint('pedidos'),
  preingresos: new Endpoint('preingresos'),
  procesadores: new Endpoint('procesadores'),
  prestamos: new Endpoint('prestamos'),
  productos: new Endpoint('productos'),
  productos_perchas: new Endpoint('productos-perchas'),
  sucursales: new Endpoint('sucursales'),
  sucursales_detalle: new Endpoint('sucursales-detalle'),
  spans: new Endpoint('spans'),
  tipos_fibras: new Endpoint('tipos-fibras'),
  tipos_transacciones: new Endpoint('tipos-transacciones'),
  transacciones: new Endpoint('transacciones'),
  transacciones_egresos: new Endpoint('transacciones-egresos'),
  transacciones_ingresos: new Endpoint('transacciones-ingresos'),
  modificar_item_egreso: new Endpoint('modificar-item-egreso'),
  gestionar_egresos: new Endpoint('gestionar-egresos'),
  transferencias: new Endpoint('transferencias'),
  traspasos: new Endpoint('traspasos'),
  subtipos_transacciones: new Endpoint('subtipos-transacciones'),
  perchas: new Endpoint('perchas'),
  pisos: new Endpoint('pisos'),
  ubicaciones: new Endpoint('ubicaciones'),
  unidades_medidas: new Endpoint('unidades-medidas'),
  imagenes_adicionales: new Endpoint('imagenes-adicionales'),
  materiales_pedidos: new Endpoint('transacciones-egresos/materiales'),
  /* REPORTES BODEGA  */
  reporte_inventario: new Endpoint('reporte-inventario'),
  kardex: new Endpoint('kardex'),

  /********************
   * Modulo de tareas
   ********************/
  ...tareas,

  /***************
  * Modulo medico
  ****************/
  ...medico,

  /********************
  * Modulo de tickets
  *********************/
  ...tickets,

  /**************************
  * Modulo de activos fijos
  ***************************/
  ...activosFijos,
  ...sso,
  ...seguridad,

  /**
   * Modulo de fondos rotativos
   */
  ...fondosRotativos,

  usuarios_autorizadores: new Endpoint('usuarios-autorizadores'),
  lista_usuarios: new Endpoint('lista-usuarios'),


  /********************
   * Modulo de Ventas de Claro
   *********************/
  bonos: new Endpoint('ventas-claro/bonos'),
  bonos_porcentuales: new Endpoint('ventas-claro/bono-porcentual'),
  comisiones: new Endpoint('ventas-claro/comisiones'),
  modalidad: new Endpoint('ventas-claro/modalidad'),
  planes: new Endpoint('ventas-claro/planes'),
  productos_ventas: new Endpoint('ventas-claro/productos-ventas'),
  vendedores_claro: new Endpoint('ventas-claro/vendedores'),
  ventas: new Endpoint('ventas-claro/ventas'),
  actualizar_comisiones_ventas: new Endpoint('ventas-claro/actualizar-comisiones-ventas'),
  obtener_comision: new Endpoint('ventas-claro/obtener-comision'),
  tipo_chargebacks: new Endpoint('ventas-claro/tipo-chargeback'),
  chargebacks: new Endpoint('ventas-claro/chargebacks'),
  cortes_pagos_comisiones: new Endpoint('ventas-claro/cortes-pagos-comisiones'),
  retenciones_chargebacks: new Endpoint('ventas-claro/retenciones-chargebacks'),
  pago_comision: new Endpoint('ventas-claro/pagos-comisiones'),
  bono_mensual_cumplimiento: new Endpoint('ventas-claro/bonos-mensuales-cumplimientos'),
  bono_trimestral_cumplimiento: new Endpoint('ventas-claro/bono-trimestral-cumplimiento'),
  cobrojp: new Endpoint('ventas-claro/cobrojp'),
  pago: new Endpoint('ventas-claro/pago'),
  reporte_ventas: new Endpoint('ventas-claro/reporte-ventas'),
  dashboard_ventas_claro: new Endpoint('ventas-claro/dashboard'),
  umbral_ventas: new Endpoint('ventas-claro/umbral-ventas'),
  esquema_comision: new Endpoint('ventas-claro/esquema-comision'),
  clientes_claro: new Endpoint('ventas-claro/clientes-claro'),
  escenario_venta_jp: new Endpoint('ventas-claro/escenario-venta-jp'),
  novedades_ventas: new Endpoint('ventas-claro/novedades-ventas'),

  //intranet
  //Modulo de Intranet
  noticias: new Endpoint('intranet/noticias'),
  eventos: new Endpoint('intranet/eventos'),
  etiquetas: new Endpoint('intranet/etiquetas'),
  categorias_noticias: new Endpoint('intranet/categorias'),
  tipos_eventos: new Endpoint('intranet/tipos-eventos'),
  organigrama: new Endpoint('intranet/organigrama'),
  organigrama_datos: new Endpoint('intranet/organigrama/datos'),
}
