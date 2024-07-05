import { Endpoint } from 'shared/http/domain/Endpoint'
import { medico } from './endpoints/medico'
import { tareas } from './endpoints/tareas'
import { tickets } from './endpoints/tickets'

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
  cambiar_contrasena: new Endpoint('user/password', false),
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
  cargos: new Endpoint('cargos'),

  motivo_permiso_empleado: new Endpoint(
    'recursos-humanos/motivo_permiso_empleado'
  ),
  estado_permiso_empleado: new Endpoint(
    'recursos-humanos/estado_permiso_empleado'
  ),
  estado_civil: new Endpoint('recursos-humanos/estado_civil'),
  familiares: new Endpoint('recursos-humanos/familiares'),

  areas: new Endpoint('recursos-humanos/areas'),
  tipo_contrato: new Endpoint('recursos-humanos/tipo_contrato'),
  tipo_licencia: new Endpoint('recursos-humanos/tipo_licencia'),
  permiso_empleado: new Endpoint('recursos-humanos/permiso_empleado'),
  licencia_empleado: new Endpoint('recursos-humanos/licencia_empleado'),
  prestamo_empresarial: new Endpoint('recursos-humanos/prestamo_empresarial'),
  solicitud_prestamo_empresarial: new Endpoint(
    'recursos-humanos/solicitud_prestamo_empresarial'
  ),
  periodo: new Endpoint('recursos-humanos/periodo'),
  anticipo: new Endpoint('recursos-humanos/anticipo'),
  rol_pago: new Endpoint('recursos-humanos/rol_pago'),
  egreso_rol_pago: new Endpoint('recursos-humanos/egreso_rol_pago'),
  ingreso_rol_pago: new Endpoint('recursos-humanos/ingreso_rol_pago'),
  rol_pago_mes: new Endpoint('recursos-humanos/rol_pago_mes'),
  banco: new Endpoint('recursos-humanos/banco'),
  datos_empleado: new Endpoint('recursos-humanos/datos_empleado/'),
  activos_fijos: new Endpoint('activos-fijos'),
  empleados: new Endpoint('empleados'),
  departamentos: new Endpoint('recursos-humanos/departamentos'),
  allroles: new Endpoint('roles'),
  concepto_ingreso: new Endpoint('recursos-humanos/concepto_ingreso'),
  descuentos_generales: new Endpoint('recursos-humanos/descuentos_generales'),
  descuentos_ley: new Endpoint('recursos-humanos/descuentos_ley'),
  multa: new Endpoint('recursos-humanos/multa'),
  prestamos_quirorafario_empleado: new Endpoint(
    'recursos-humanos/prestamos_quirorafario_empleado'
  ),
  prestamos_hipotecario_empleado: new Endpoint(
    'recursos-humanos/prestamos_hipotecario_empleado'
  ),
  extension_covertura_salud_empleado: new Endpoint(
    'recursos-humanos/extension_covertura_salud_empleado'
  ),
  extension_covertura_salud: new Endpoint(
    'recursos-humanos/extension_covertura_salud'
  ),
  archivo_rol_pago_mes: new Endpoint('recursos-humanos/archivo-rol-pago-mes'),


  porcentaje_iess: new Endpoint('recursos-humanos/porcentaje_iess'),
  porcentaje_anticipo: new Endpoint('recursos-humanos/porcentaje_anticipo'),

  horas_extras_tipo: new Endpoint('recursos-humanos/horas_extras_tipo'),
  horas_extras_subtipo: new Endpoint('recursos-humanos/horas_extras_subtipo'),
  forma_pago: new Endpoint('forma_pago'),
  sueldo_basico: new Endpoint('recursos-humanos/sueldo_basico'),
  nivel_endeudamiento: new Endpoint('recursos-humanos/nivel_endeudamiento'),
  aprobar_prestamo_empresarial: new Endpoint(
    'recursos-humanos/aprobar_prestamo_empresarial'
  ),
  rechazar_prestamo_empresarial: new Endpoint(
    'recursos-humanos/rechazar_prestamo_empresarial'
  ),
  vacacion: new Endpoint('recursos-humanos/vacacion'),
  archivo_permiso_empleado: new Endpoint(
    'recursos-humanos/archivo_permiso_empleado'
  ),
  archivo_licencia_empleado: new Endpoint(
    'recursos-humanos/archivo_licencia_empleado'
  ),
  archivo_prestamo_hipotecario: new Endpoint(
    'recursos-humanos/archivo_prestamo_hipotecario'
  ),
  archivo_prestamo_quirirafario: new Endpoint(
    'recursos-humanos/archivo_prestamo_quirorafario'
  ),
  archivo_rol_pago: new Endpoint('recursos-humanos/archivo_rol_pago'),
  archivo_extencion_conyugal: new Endpoint(
    'recursos-humanos/archivo_extencion_conyugal'
  ),

  descuentos_permiso: new Endpoint('recursos-humanos/descuentos_permiso'),
  prestamo_hipotecario: new Endpoint('recursos-humanos/prestamo_hipotecario'),
  prestamo_quirorafario: new Endpoint('recursos-humanos/prestamo_quirorafario'),
  permisos_sin_recuperar: new Endpoint(
    'recursos-humanos/permisos_sin_recuperar'
  ),
  obtener_prestamo_empleado: new Endpoint(
    'recursos-humanos/obtener_prestamo_empleado'
  ),
  otener_saldo_empleado_mes: new Endpoint(
    'recursos-humanos/otener_saldo_empleado_mes'
  ),
  imprimir_rol_pago: new Endpoint('recursos-humanos/imprimir_rol_pago/'),
  imprimir_rol_pago_general: new Endpoint(
    'recursos-humanos/imprimir_rol_pago_general/'
  ),
  imprimir_reporte_general: new Endpoint(
    'recursos-humanos/imprimir_reporte_general/'
  ),
  imprimir_reporte_general_empleado: new Endpoint(
    'recursos-humanos/imprimir_reporte_general_empleado'
  ),
  imprimir_reporte_general_alimentacion: new Endpoint(
    'recursos-humanos/imprimir-reporte-general-alimentacion/'
  ),

  verificar_todos_roles_finalizadas: new Endpoint(
    'recursos-humanos/verificar-todos_roles-finalizadas'
  ),
  finalizar_rol_pago: new Endpoint('recursos-humanos/finalizar-rol-pago'),
  habilitar_empleado: new Endpoint('recursos-humanos/habilitar-empleado'),
  generar_username: new Endpoint('recursos-humanos/generar-username'),


  actualizar_rol_pago: new Endpoint('recursos-humanos/actualizar-rol-pago/'),
  agregar_nuevos_empleados: new Endpoint('recursos-humanos/agregar-nuevos-empleados/'),

  enviar_rol_pago: new Endpoint('recursos-humanos/enviar-roles-pago/'),
  enviar_rol_pago_empleado: new Endpoint(
    'recursos-humanos/enviar-rol-pago-empleado/'
  ),

  crear_cash_roles_pago: new Endpoint(
    'recursos-humanos/crear-cash-roles-pago/'
  ),
  crear_cash_alimentacion: new Endpoint(
    'recursos-humanos/crear-cash-alimentacion/'
  ),
  rubros: new Endpoint('recursos-humanos/rubros'),
  tipos_discapacidades: new Endpoint('recursos-humanos/tipos-discapacidades'),
  anular_prestamo_empresarial: new Endpoint('recursos-humanos/anular-prestamo-empresarial'),
  asignar_alimentacion: new Endpoint('recursos-humanos/asignar-alimentacion'),
  alimentacion: new Endpoint('recursos-humanos/alimentacion'),
  detalle_alimentacion: new Endpoint('recursos-humanos/detalle-alimentacion'),
  finalizar_asignacion_alimentacion: new Endpoint('recursos-humanos/finalizar-asignacion-alimentacion'),
  /********************
  * Modulo de  Seleccion y contratacion
  *********************/
  solicitud_puesto_empleo: new Endpoint('recursos-humanos/solicitud-puesto-empleo'),
  publicacion_puesto_empleo: new Endpoint('recursos-humanos/publicacion-puesto-empleo'),
  tipos_puestos_trabajos: new Endpoint('recursos-humanos/tipos_puestos_trabajos'),
  postulantes: new Endpoint('recursos-humanos/postulantes'),
  registro: new Endpoint('recursos-humanos/registro'),



  /******************************
   * Modulo de Vehiculos
   ******************************/
  combustibles: new Endpoint('vehiculos/combustibles'),
  garajes: new Endpoint('vehiculos/garajes'),
  vehiculos: new Endpoint('vehiculos/vehiculos'),
  tipos_vehiculos: new Endpoint('vehiculos/tipos-vehiculos'),
  bitacoras_vehiculos: new Endpoint('vehiculos/bitacoras-vehiculos'),
  ultima_bitacora: new Endpoint('vehiculos/ultima-bitacora'),
  registros_incidentes: new Endpoint('vehiculos/registros-incidentes'),
  historial_vehiculos: new Endpoint('vehiculos/historial'),
  empleados_choferes: new Endpoint('vehiculos/empleados-choferes'),
  conductores: new Endpoint('vehiculos/conductores'),
  matriculas: new Endpoint('vehiculos/matriculas'),
  ordenes_reparaciones: new Endpoint('vehiculos/ordenes-reparaciones'),
  asignaciones_vehiculos: new Endpoint('vehiculos/asignaciones-vehiculos'),
  transferencias_vehiculos: new Endpoint('vehiculos/transferencias-vehiculos'),
  multas_conductores: new Endpoint('vehiculos/multas'),
  seguros: new Endpoint('vehiculos/seguros'),
  servicios: new Endpoint('vehiculos/servicios'),
  tanqueos: new Endpoint('vehiculos/tanqueos'),
  planes_mantenimientos: new Endpoint('vehiculos/planes-mantenimientos'),
  mantenimientos_vehiculos: new Endpoint('vehiculos/mantenimientos-vehiculos'),
  reporte_conductor_licencia: new Endpoint('vehiculos/reporte-conductor-licencia'),
  reporte_combustibles: new Endpoint('vehiculos/reporte-combustibles'),
  reporte_seguros_vehiculos: new Endpoint('vehiculos/reporte-seguros-vehiculos'),

  //Modulo de compras y proveedores
  dashboard_compras: new Endpoint('compras/dashboard'),
  empleados_ordenes: new Endpoint('compras/empleados-ordenes'),
  proveedores_ordenes: new Endpoint('compras/proveedores-ordenes'),
  clientes_prefacturas: new Endpoint('compras/clientes-prefacturas'),
  dashboard_ventas_empresa: new Endpoint('compras/dashboard-ventas'),
  calificacion_proveedor: new Endpoint('compras/calificaciones-proveedores'),
  categorias_ofertas: new Endpoint('compras/categorias-ofertas'),
  contactos_proveedores: new Endpoint('compras/contactos-proveedores'),
  criterios_calificaciones: new Endpoint('compras/criterios-calificaciones'),
  datos_bancarios_proveedor: new Endpoint(
    'compras/datos-bancarios-proveedores'
  ),
  detalles_departamentos_proveedor: new Endpoint(
    'compras/detalles-departamentos-proveedor'
  ),
  empresas: new Endpoint('empresas'),
  log_contactos_proveedores: new Endpoint('compras/log-contactos-proveedores'),
  ofertas_proveedores: new Endpoint('compras/ofertas-proveedores'),
  ordenes_compras: new Endpoint('compras/ordenes-compras'),
  pagos_proveedores: new Endpoint('compras/pagos-proveedores'),
  preordenes_compras: new Endpoint('compras/preordenes-compras'),
  preordenes_compras_consolidadas: new Endpoint('compras/preordenes-consolidadas'),
  novedades_ordenes_compras: new Endpoint('compras/novedades-ordenes-compras'),
  prefacturas: new Endpoint('compras/prefacturas'),
  proformas: new Endpoint('compras/proformas'),
  proveedores: new Endpoint('proveedores'),
  reporte_proveedores: new Endpoint('compras/reporte-proveedores'),

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

  // Modulo Fondos Rotativos
  empleados_saldos_fr: new Endpoint('fondos-rotativos/empleados-saldos-fr'),
  empleados_fondos_rotativos: new Endpoint('empleados-fondos-rotativos'),
  reporte_valores_fondos_empleados: new Endpoint('fondos-rotativos/reporte-valores-fondos'),
  tipo_fondo: new Endpoint('fondos-rotativos/tipo-fondo'),
  ajustes_saldos: new Endpoint('fondos-rotativos/ajustes-saldos'),
  gastos: new Endpoint('fondos-rotativos/gastos'),
  motivo_gasto: new Endpoint('fondos-rotativos/motivo-gasto'),
  gasto_coordinador: new Endpoint('fondos-rotativos/gasto-coordinador'),
  aprobar_gasto: new Endpoint('fondos-rotativos/aprobar-gasto'),
  rechazar_gasto: new Endpoint('fondos-rotativos/rechazar-gasto'),
  anular_gasto: new Endpoint('fondos-rotativos/anular-gasto'),
  aprobar_trnasferencia: new Endpoint('fondos-rotativos/aprobar-transferencia'),
  rechazar_transferencia: new Endpoint(
    'fondos-rotativos/rechazar-transferencia'
  ),
  anular_transferencia: new Endpoint('fondos-rotativos/anular-transferencia'),
  anular_acreditacion: new Endpoint('fondos-rotativos/anular-acreditacion'),
  detalle_fondo: new Endpoint('fondos-rotativos/detalles-viaticos'),
  sub_detalle_fondo: new Endpoint('fondos-rotativos/sub-detalles-viaticos'),
  saldo: new Endpoint('fondos-rotativos/saldo-grupo'),
  tipo_saldo: new Endpoint('fondos-rotativos/tipo-saldo'),
  usuarios_autorizadores: new Endpoint('usuarios-autorizadores'),
  lista_usuarios: new Endpoint('lista-usuarios'),
  fondo_rotativo_fecha_excel: new Endpoint(
    'fondos-rotativos/reporte/fecha/excel'
  ),
  fondo_rotativo_fecha_pdf: new Endpoint('fondos-rotativos/reporte/fecha/pdf'),
  fondo_rotativo_autorizaciones_fecha_pdf: new Endpoint(
    'fondos-rotativos/autorizaciones_fecha/pdf'
  ),
  fondo_rotativo_autorizaciones_fecha_excel: new Endpoint(
    'fondos-rotativos/autorizaciones_fecha/excel'
  ),
  consolidado_pdf: new Endpoint('fondos-rotativos/consolidado/pdf'),
  consolidado_excel: new Endpoint('fondos-rotativos/consolidado/excel'),
  consolidado_filtrado_pdf: new Endpoint(
    'fondos-rotativos/consolidado_filtrado/pdf'
  ),
  consolidado_filtrado_excel: new Endpoint(
    'fondos-rotativos/consolidado_filtrado/excel'
  ),
  autorizaciones_gastos: new Endpoint('fondos-rotativos/autorizaciones_gastos'),
  autorizaciones_transferencia: new Endpoint(
    'fondos-rotativos/autorizaciones_transferencia'
  ),
  umbral: new Endpoint('fondos-rotativos/umbral'),
  acreditacion: new Endpoint('fondos-rotativos/acreditacion'),
  transferencia: new Endpoint('fondos-rotativos/transferencia'),
  ultimo_saldo: new Endpoint('fondos-rotativos/ultimo_saldo'),
  monto_acreditar_usuario: new Endpoint(
    'fondos-rotativos/monto_acreditar_usuario'
  ),
  cortar_saldo: new Endpoint('fondos-rotativos/cortar_saldo'),

  reporte_saldo_actual_excel: new Endpoint(
    'fondos-rotativos/reporte/saldo_actual/excel'
  ),
  reporte_saldo_actual_pdf: new Endpoint(
    'fondos-rotativos/reporte/saldo_actual/pdf'
  ),
  reporte_solicitud_fondo_pdf: new Endpoint(
    'fondos-rotativos/reporte/solicitud_fondo/pdf'
  ),
  reporte_solicitud_fondo_excel: new Endpoint(
    'fondos-rotativos/reporte/solicitud_fondo/excel'
  ),
  gastocontabilidad: new Endpoint('fondos-rotativos/gastocontabilidad'),
  acreditacion_semana: new Endpoint('fondos-rotativos/acreditacion-semana'),
  valor_acreditar: new Endpoint('fondos-rotativos/valor-acreditar'),
  crear_cash_acreditacion_saldo: new Endpoint('fondos-rotativos/crear-cash-acreditacion-saldo/'),
  acreditacion_saldo_semana: new Endpoint('fondos-rotativos/acreditacion-saldo-semana/'),
  reporte_acreditacion_semanal: new Endpoint('fondos-rotativos/reporte-acreditacion-semanal/'),

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





}
