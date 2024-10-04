import { Endpoint } from 'shared/http/domain/Endpoint'
import { seleccionContratacionPersonal } from './seleccionContratacionPersonal'

export const recursosHumanos = {
  empleados: new Endpoint('empleados'),
  solicitudes_vacaciones: new Endpoint('recursos-humanos/solicitudes-vacaciones'),
  vacaciones: new Endpoint('recursos-humanos/vacaciones'),
  planes_vacaciones: new Endpoint('recursos-humanos/planes-vacaciones'),
  /***************************************************
   *  Submodulo selección y contratación de personal
   **************************************************/
  ...seleccionContratacionPersonal
}
