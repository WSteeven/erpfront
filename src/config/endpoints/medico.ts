import { Endpoint } from 'shared/http/domain/Endpoint'

export const medico = {

  gestion_cliente: new Endpoint('medico/tipos-elementos'),
  registros_empleados_examenes: new Endpoint('medico/registros-empleados-examenes'),
  categorias_examenes: new Endpoint('medico/categorias-examenes'),
  examenes: new Endpoint('medico/examenes'),
  estados_examenes: new Endpoint('medico/estados-examenes'),
  tipos_examenes: new Endpoint('medico/tipos-examenes'),
}
