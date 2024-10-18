import { Endpoint } from 'shared/http/domain/Endpoint';

/********************
 * Endpoints Modulo de  Seleccion y Contratacion de Personal
 *********************/

export const seleccionContratacionPersonal = {
  areas_conocimientos: new Endpoint('seleccion-contratacion/conocimientos'),
  solicitud_puesto_empleo: new Endpoint('seleccion-contratacion/solicitudes-nuevo-personal'),
  vacantes: new Endpoint('seleccion-contratacion/vacantes'),
  tipos_puestos: new Endpoint('seleccion-contratacion/tipos-puestos'),
  modalidades: new Endpoint('seleccion-contratacion/modalidades'),
  postulantes: new Endpoint('seleccion-contratacion/postulantes'),
  entrevistas: new Endpoint('seleccion-contratacion/entrevistas'),
  examenes_postulantes: new Endpoint('seleccion-contratacion/examenes-postulantes'),
  postulacion_vacante: new Endpoint('seleccion-contratacion/postulaciones-vacantes'),
  user_curriculums: new Endpoint('seleccion-contratacion/curriculums-usuario'),
  user_referencias: new Endpoint('seleccion-contratacion/referencias-usuario'),
  vacante_favorita: new Endpoint('seleccion-contratacion/vacante-favorita'), //para marcar una vacante como favorita
  vacantes_favoritas: new Endpoint('seleccion-contratacion/vacantes-favoritas'),
  bancos_postulantes: new Endpoint('seleccion-contratacion/bancos-postulantes'),
  usuarios_externos: new Endpoint('seleccion-contratacion/usuarios-externos'),



}
