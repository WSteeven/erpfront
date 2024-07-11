import { Endpoint } from "shared/http/domain/Endpoint";

/********************
 * Endpoints Modulo de  Seleccion y Contratacion de Personal
 *********************/

export const seleccionContratacionPersonal = {
    areas_conocimientos: new Endpoint('seleccion-contratacion/conocimientos'),
    solicitud_puesto_empleo: new Endpoint('seleccion-contratacion/solicitudes-nuevo-personal'),
    vacantes: new Endpoint('seleccion-contratacion/vacantes'),
    tipos_puestos_trabajos: new Endpoint('seleccion-contratacion/tipos-puestos-trabajos'),
    postulantes: new Endpoint('seleccion-contratacion/postulantes'),
    registro: new Endpoint('seleccion-contratacion/registro'),

}