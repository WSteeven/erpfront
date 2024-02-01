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
  resultados_examenes: new Endpoint('medico/resultados-examenes'),
  configuraciones_examenes_categorias: new Endpoint(
    'medico/configuraciones-examenes-categ'
  ),
  configuraciones_examenes_campos: new Endpoint(
    'medico/configuraciones-examenes-campos'
  ),
  archivo_cie: new Endpoint('recursos-humanos/archivo-cie'),
  cie: new Endpoint('recursos-humanos/cie'),

}
