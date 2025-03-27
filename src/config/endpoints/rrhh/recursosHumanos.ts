import { Endpoint } from 'shared/http/domain/Endpoint'
import { seleccionContratacionPersonal } from './seleccionContratacionPersonal'
import { trabajoSocial } from 'config/endpoints/rrhh/trabajoSocial'

export const recursosHumanos = {
  empleados: new Endpoint('empleados'),
  empleados_delegados: new Endpoint('recursos-humanos/empleados-delegados'),
  departamentos: new Endpoint('recursos-humanos/departamentos'),
  motivo_permiso_empleado: new Endpoint('recursos-humanos/motivo_permiso_empleado'),
  estado_permiso_empleado: new Endpoint('recursos-humanos/estado_permiso_empleado'),
  estado_civil: new Endpoint('recursos-humanos/estado_civil'),
  familiares: new Endpoint('recursos-humanos/familiares'),
  areas: new Endpoint('recursos-humanos/areas'),
  tipo_contrato: new Endpoint('recursos-humanos/tipo_contrato'),
  tipo_licencia: new Endpoint('recursos-humanos/tipo_licencia'),
  permiso_empleado: new Endpoint('recursos-humanos/permiso_empleado'),
  licencia_empleado: new Endpoint('recursos-humanos/licencia_empleado'),
  prestamo_empresarial: new Endpoint('recursos-humanos/prestamo_empresarial'),
  solicitud_prestamo_empresarial: new Endpoint('recursos-humanos/solicitud-prestamo-empresarial'),
  periodo: new Endpoint('recursos-humanos/periodo'),
  anticipo: new Endpoint('recursos-humanos/anticipo'),
  rol_pago: new Endpoint('recursos-humanos/rol_pago'),
  egreso_rol_pago: new Endpoint('recursos-humanos/egreso_rol_pago'),
  ingreso_rol_pago: new Endpoint('recursos-humanos/ingreso_rol_pago'),
  rol_pago_mes: new Endpoint('recursos-humanos/rol_pago_mes'),
  concepto_ingreso: new Endpoint('recursos-humanos/concepto_ingreso'),
  descuentos_generales: new Endpoint('recursos-humanos/descuentos_generales'),
  descuentos_ley: new Endpoint('recursos-humanos/descuentos_ley'),
  descuentos: new Endpoint('recursos-humanos/descuentos'),
  multa: new Endpoint('recursos-humanos/multa'),
  prestamos_quirorafario_empleado: new Endpoint(
    'recursos-humanos/prestamos_quirorafario_empleado'
  ),
  prestamos_hipotecario_empleado: new Endpoint(
    'recursos-humanos/prestamos_hipotecario_empleado'
  ),
  extension_cobertura_salud_empleado: new Endpoint(
    'recursos-humanos/extension_cobertura_salud_empleado'
  ),
  extension_cobertura_salud: new Endpoint(
    'recursos-humanos/extension_cobertura_salud'
  ),
  porcentaje_iess: new Endpoint('recursos-humanos/porcentaje_iess'),
  porcentaje_anticipo: new Endpoint('recursos-humanos/porcentaje_anticipo'),
  horas_extras_tipo: new Endpoint('recursos-humanos/horas-extras-tipo'),
  horas_extras_subtipo: new Endpoint('recursos-humanos/horas_extras_subtipo'),

  banco: new Endpoint('recursos-humanos/banco'),
  datos_empleado: new Endpoint('recursos-humanos/datos_empleado/'),
  sueldo_basico: new Endpoint('recursos-humanos/sueldo_basico'),
  nivel_endeudamiento: new Endpoint('recursos-humanos/nivel_endeudamiento'),
  aprobar_prestamo_empresarial: new Endpoint(
    'recursos-humanos/aprobar_prestamo_empresarial'
  ),
  rechazar_prestamo_empresarial: new Endpoint(
    'recursos-humanos/rechazar_prestamo_empresarial'
  ),


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
  prestamos_quirografarios: new Endpoint('recursos-humanos/prestamos_quirografarios'),
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
    'recursos-humanos/verificar-todos-roles-finalizadas'
  ),
  finalizar_rol_pago: new Endpoint('recursos-humanos/finalizar-rol-pago'),
  activar_rol_pago: new Endpoint('recursos-humanos/activar-rol-pago/'),
  habilitar_empleado: new Endpoint('recursos-humanos/habilitar-empleado'),
  generar_username: new Endpoint('recursos-humanos/generar-username'),


  actualizar_rol_pago: new Endpoint('recursos-humanos/actualizar-rol-pago/'),
  agregar_nuevos_empleados: new Endpoint('recursos-humanos/agregar-nuevos-empleados/'),
  valores_cargados_roles: new Endpoint('recursos-humanos/valores-cargados-roles'),

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


  solicitudes_vacaciones: new Endpoint('recursos-humanos/solicitudes-vacaciones'),
  vacaciones: new Endpoint('recursos-humanos/vacaciones'),
  detalles_vacaciones: new Endpoint('recursos-humanos/detalles-vacaciones'),
  planes_vacaciones: new Endpoint('recursos-humanos/planes-vacaciones'),
  planificadores: new Endpoint('recursos-humanos/planificadores'),
  registro: new Endpoint('recursos-humanos/registro'),
  user_discapacidades: new Endpoint('recursos-humanos/discapacidades-usuario'),
  derecho_vacaciones: new Endpoint('recursos-humanos/solicitudes-vacaciones/derecho-vacaciones'),
  /***************************************************
   *  Submodulo selección y contratación de personal
   **************************************************/
  ...seleccionContratacionPersonal,

  /***************************************************
   *  Submodulo selección y contratación de personal
   **************************************************/
  ...trabajoSocial,

}
