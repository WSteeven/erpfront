import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Asistencia extends EntidadAuditable {
  empleado: number | null;
  fecha: Date | null;
  hora_ingreso: Date | null;
  hora_salida: Date | null;
  hora_salida_almuerzo: Date | null;
  hora_entrada_almuerzo: Date | null;

  constructor() {
    super();
    this.empleado = null;
    this.fecha = null;
    this.hora_ingreso = null;
    this.hora_salida = null;
    this.hora_salida_almuerzo = null;
    this.hora_entrada_almuerzo = null;
  }
}
