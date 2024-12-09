import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Justificacion extends EntidadAuditable {
  empleadoId: number | null;
  fechaAtraso: Date | null; // Fecha de atraso.
  horasAtraso: number | null; // Horas de atraso.
  minutosAtraso: number | null; // Minutos de atraso.
  segundosAtraso: number | null; // Segundos de atraso.
  justificacion: string | null; // Texto de la justificación.

  constructor() {
    super();
    this.empleadoId = null;
    this.fechaAtraso = null;
    this.horasAtraso = null;
    this.minutosAtraso = null;
    this.segundosAtraso = null;
    this.justificacion = null;
  }
}
