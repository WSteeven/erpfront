import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Asistencia extends EntidadAuditable {
  empleado: string | null;
  horaIngreso: Date | null;
  horaSalida: Date | null;
  horaSalidaAlmuerzo: Date | null;
  horaEntradaAlmuerzo: Date | null;

  constructor() {
    super();
    this.empleado = null;
    this.horaIngreso = null;
    this.horaSalida = null;
    this.horaSalidaAlmuerzo = null;
    this.horaEntradaAlmuerzo = null;
  }
}
