import { Endpoint } from 'shared/http/domain/Endpoint'
import { seleccionContratacionPersonal } from './seleccionContratacionPersonal'

export const recursosHumanos = {
  empleados: new Endpoint('empleados'),
  solicitudes_vacaciones: new Endpoint('recursos-humanos/solicitudes-vacaciones'),
  vacaciones: new Endpoint('recursos-humanos/vacaciones'),
  planes_vacaciones: new Endpoint('recursos-humanos/planes-vacaciones'),
  registro: new Endpoint('recursos-humanos/registro'),
  user_discapacidades: new Endpoint('recursos-humanos/discapacidades-usuario'),
  /***************************************************
   *  Submodulo selección y contratación de personal
   **************************************************/
  ...seleccionContratacionPersonal
}
