import { Endpoint } from 'shared/http/domain/Endpoint'

export const medico = {
  gestion_cliente: new Endpoint('medico/tipos-elementos'),
  registros_empleados_examenes: new Endpoint(
    'medico/registros-empleados-examenes'
  ),
  categorias_examenes: new Endpoint('medico/categorias-examenes'),
  examenes: new Endpoint('medico/examenes'),
  estados_examenes: new Endpoint('medico/estados-examenes'),
  estados_solicitudes_examenes: new Endpoint(
    'medico/estados-solicitudes-examenes'
  ),
  tipos_examenes: new Endpoint('medico/tipos-examenes'),
  detalles_resultados_examenes: new Endpoint('medico/detalles-resultados-examenes'),
  resultados_examenes: new Endpoint('medico/resultados-examenes'),
  archivo_cie: new Endpoint('medico/archivo-cie'),
  cie: new Endpoint('medico/cie'),
  configuraciones_examenes_categorias: new Endpoint('medico/configuraciones-examenes-categ'),
  configuraciones_examenes_campos: new Endpoint('medico/configuraciones-examenes-campos'),
  laboratorios_clinicos: new Endpoint('medico/laboratorios-clinicos'),
  respuestas_cuestionarios_empleados: new Endpoint('medico/resp-cuestionarios-empleados'),
  preguntas: new Endpoint('medico/preguntas'),
  citas_medicas: new Endpoint('medico/citas-medicas'),
  consultas: new Endpoint('medico/consultas'),
  esquemas_vacunas: new Endpoint('medico/esquemas-vacunas'),
  reporte_cuestionario: new Endpoint('medico/reporte-cuestionario'),
  // configuracion_cuestionario_empleado: new Endpoint('medico/config-cuestionario-empleado'),
  configuracion_cuestionario_empleado: new Endpoint('medico/config-cuestionario-empleado'),
}
